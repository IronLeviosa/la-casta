# Crítica — corrida 2026-09-16-correccion-batlle-fecha-ultima-entrevista

Lote: inbox/correcciones/2026-09-16/ (corrección, no investigación)
Registros revisados: 10 (todos; sin muestra)

## Veredicto sobre la premisa del pedido

La premisa es falsa en su punto central: **la fuente sí dice cuándo se hizo la entrevista**. La copia completa de la misma nota (Wayback de `www.elobservador.com.uy/nota/la-ultima-entrevista-de-batlle-con-el-observador-20161025500`, 5.662 caracteres) abre con:

> "Aquí un resumen de la entrevista con Leandro Gómez, realizada el 21 de setiembre de 2016:"

La copia del corpus de la URL canónica (`8c6848cd64…`, 3.449 caracteres) está recortada: empieza a mitad de la entrevista («No es la única razón...Es la fundamental.») y le faltan la bajada, la fecha y las tres primeras preguntas. `validar --red` no lo detectó porque las diez citas están en la parte conservada. Los `notas_internas` confirman que los registros tenían antes fecha 21/09/2016 y se «corrigieron» a 2016-10-24 leyendo esa copia recortada.

Según el brief («Si la fuente da la fecha de la entrevista, no se aplica la corrección: se informa») la corrección pedida (agregar `fecha_precision: antes_de` y dejar 2016-10-24) **no se aplica**. Sería técnicamente cierta (la entrevista fue antes del 24/10), pero publicaría una fecha menos precisa que la que da la fuente y dejaría en dos resúmenes una afirmación falsa («no está documentada»). El cambio correcto es otro: `fecha: 2016-09-21` sin `fecha_precision` en los diez registros, con cambio de id por `reemplaza:` (los ids llevan la fecha), el campo `declaracion` de los cuatro chequeos apuntando a los ids nuevos y los textos para el lector de abajo reescritos.

Cota más ajustada que el fallecimiento: no hace falta, la fuente da el día.

## Resumen
```yaml
- registro: lote (los diez)
  severidad: bloquea
  tipo: contexto_omitido
- registro: declaraciones[0]
  severidad: bloquea
  tipo: contexto_omitido
- registro: declaraciones[1]
  severidad: bloquea
  tipo: contexto_omitido
- registro: menciones[0]
  severidad: corregir
  tipo: contexto_omitido      # solo la fecha (objeción al lote); no tiene texto para el lector que la mencione
- registro: menciones[1]
  severidad: corregir
  tipo: contexto_omitido      # ídem
- registro: menciones[2]
  severidad: corregir
  tipo: contexto_omitido      # ídem
- registro: menciones[3]
  severidad: corregir
  tipo: contexto_omitido      # ídem
- registro: chequeos[0]
  severidad: aviso
  tipo: documento_previsible
- registro: chequeos[1]
  severidad: corregir
  tipo: contexto_omitido      # solo la fecha; el análisis no depende del día
- registro: chequeos[2]
  severidad: corregir
  tipo: contexto_omitido
- registro: chequeos[3]
  severidad: corregir
  tipo: contexto_omitido      # solo la fecha; el análisis no depende del día
```

## Objeciones por registro

### declaraciones[0] — 2016-10-24 — «No, el año que viene es peor porque los impuestos…»
- severidad: bloquea
- tipo: contexto_omitido
- objecion: el `resumen` afirma «La fecha exacta en que dio la entrevista no está documentada; se usa como fecha el 24 de octubre de 2016, día de su muerte». Es falso: la bajada de la misma nota da el 21 de setiembre de 2016. Además la bajada aclara que el texto es «un resumen de la entrevista» hecha por Leandro Gómez, dato que ningún registro recoge. La cita en su párrafo dice lo mismo que el resumen (respuesta a «¿No hay tiempo de recuperación económica para el FA en el gobierno?»).
- cita_de_contexto: "Aquí un resumen de la entrevista con Leandro Gómez, realizada el 21 de setiembre de 2016:" (https://web.archive.org/web/20231128085738/https://www.elobservador.com.uy/nota/la-ultima-entrevista-de-batlle-con-el-observador-20161025500)
- accion_sugerida: fecha 2016-09-21 con `reemplaza:`; resumen sin la oración sobre la fecha no documentada, con algo como «en una entrevista realizada el 21 de setiembre de 2016 y publicada por El Observador el 25 de octubre, un día después de su muerte».

### declaraciones[1] — 2016-10-24 — «Por una razón muy sencilla, en esos primeros cinco años…»
- severidad: bloquea
- tipo: contexto_omitido
- objecion: mismo error que declaraciones[0]: el resumen dice que la fecha «no está documentada» y agrega «porque no pudo haberla dado después de morir». La cita, en su párrafo (respuesta a «¿Sólo una crisis puede hacer perder al FA?»), coincide con el resumen.
- cita_de_contexto: la misma bajada (misma URL de Wayback).
- accion_sugerida: la misma que declaraciones[0].

### chequeos[2] — 2016-10-24 — Vigencia de la Ley de Rendición de Cuentas 2015
- severidad: corregir
- tipo: contexto_omitido
- objecion: el `analisis` dice «Cuando habló, la ley todavía era un proyecto en el Parlamento». Con la fecha publicada (24/10) eso es falso: IMPO da «Promulgación: 14/10/2016 Publicación: 26/10/2016». Con la fecha real (21/09) es coherente con la promulgación, pero que el proyecto siguiera en el Parlamento ese día depende de la fecha de sanción, que no está en el registro.
- cita_de_contexto: "Promulgación: 14/10/2016 Publicación: 26/10/2016" (https://impo.com.uy/bases/leyes/19438-2016)
- accion_sugerida: corregir la fecha; confirmar la sanción con el diario de sesiones de la última votación (`pnpm sesion`) o, si no se confirma, escribir «todavía no estaba promulgada».

### chequeos[0] — 2016-10-24 — Precio del combustible frente a la paridad de importación (setiembre de 2016)
- severidad: aviso
- tipo: documento_previsible
- objecion: el título («setiembre de 2016») y el análisis («agosto o setiembre de 2016») concuerdan con la fecha real y contradicen la publicada. Si se hubiera aplicado `antes_de` 2016-10-24 sin tocarlos, el lector vería un período distinto al de la fecha. Aparte, fuera del alcance de esta corrección: el PPI de URSEA de setiembre de 2016 es un documento previsible.
- accion_sugerida: después de fijar la fecha, correr `pnpm dato --lista` y la serie de paridad de URSEA; si no cubre 2016, pedir el informe mensual PDF de URSEA de setiembre de 2016 (`pnpm inventario ursea.gub.uy --desde 2016 --hasta 2016`).

## Objeciones al lote
- **Fecha errada en los diez registros (bloquea).** Los diez comparten una fuente y una fecha, 2016-10-24, que contradice la bajada de la nota (21/09/2016). Ejemplos: declaraciones[0], declaraciones[1], menciones[0], chequeos[1], chequeos[3]. Recomendación: resolver este pedido como `rechazada`, con fundamento, `motivo_rechazo` que diga que la fuente da la fecha y `que_cambiaria_la_decision` (una fuente que muestre que la entrevista no es del 21/09), y abrir una corrección nueva con `reemplaza:` hacia `batlle/2016-09-21-*`. Lo decide el editor. `cargo_en_ese_momento` no cambia.
- **Copia del corpus recortada (defecto de herramienta, aviso para el taller).** `8c6848cd64` (3.449 caracteres) frente a la copia de Wayback `89144bc67b` (5.662 caracteres) de la misma nota: se perdió el principio. Cualquier otro registro que cite esa URL comparte el riesgo, y otras notas de El Observador de esa época pueden estar igual. Se puede medir con un script que compare el largo del texto del corpus con su copia de Wayback, por medio. No lo corrió este rol.
- **Primaria posible.** La nota es «un resumen» de una entrevista de Leandro Gómez; puede existir audio o video del 21/09/2016, que daría `textual`. La búsqueda web solo devolvió la nota del 25/10; `pnpm descubrir el-observador` no leyó sitemaps (0 URL). Queda como pista, sin URL.
- Simetría: no aplica por sí misma (corrección interna disparada por una regla general), pero la misma revisión de `fecha_precision` debería correr sobre toda entrevista póstuma o archivo sin fecha de cualquier persona, no solo sobre Batlle.
- No quedó nada sin revisar.

## Objeciones al brief
- Sin violación de la Regla 0. El brief preveía este desenlace («Si la fuente da la fecha de la entrevista, no se aplica la corrección: se informa»).

## Cobertura
```yaml
- medio: el-observador
  url: https://elobservador.com.uy/nota/la-ultima-entrevista-de-batlle-con-el-observador-20161025500
  fecha: 2016-10-25
  evento: propuesto:fallecimiento-jorge-batlle-2016
  politico: batlle
  tono: neutral
  justificacion: >-
    La nota presenta las respuestas sin valoración propia y se limita a enmarcarlas: "Aquí un resumen de la entrevista con Leandro Gómez, realizada el 21 de setiembre de 2016".
```
