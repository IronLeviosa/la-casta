# Razones — corrida 2026-09-07-empresas-antel

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor del 2026-09-07 (ver `CLAUDE.md`,
regla 14, y `editor.md`). No hay desvío de la regla de modelos que reportar: investigador y editor
en Sonnet, crítico en Opus, tal como manda la tabla salvo el experimento vigente (que en esta corrida
no aplicó).

Esta corrida llegó con `notas.md` (segunda vuelta del investigador) ya resolviendo 30 de las 36
objeciones de `critica.md` sobre el crudo. Lo que sigue es lo que hice yo sobre lo que llegó de esa
segunda vuelta: calificar, ordenar para el lector, cerrar lo mecánico que faltaba y resolver lo que
la segunda vuelta dejó para el editor.

## Cambios no triviales

1. **`_slug: antel` agregado al registro de `empresas.yaml`.** El investigador no lo puso; sin él,
   `derivarId` cae al caso por defecto (`slugificar(JSON.stringify(...))`) y el id de la ficha no
   sería `antel`, rompiendo la referencia `empresa: antel` de `analisis.yaml` y de
   `content/medios/antel.yaml`. No es una objeción de la crítica: es un requisito mecánico del
   pipeline que faltaba.
2. **`content/medios/antel.yaml` creado** (objeción 35, corregir), con `propiedad` y `alineamiento`
   citando el balance 2024 leído con `pnpm fuente` en esta sesión. No creé `content/medios/ursec.yaml`:
   ninguna fuente de URSEC entró en esta corrida (ver objeción 28, no resuelta), así que hubiera sido
   un medio sin uso.
3. **`impuestos_pagados.concepto` acortado a una oración en los diez años** (objeción 8, corregir):
   pasó de un texto de dos cláusulas ("...retención"; el documento no publica..." / "...retención",
   bloque individual...") a una frase corta y uniforme; la aclaración de método (qué suma, que no hay
   renglón de "total impuestos", que 2022-2024 usan el bloque individual) se movió al `resumen` de la
   ficha, que es donde el rol pide que vaya "lo largo" de un `concepto`.
4. **`resumen` de la ficha, escrito entero por mí** (el investigador no lo escribe): rentabilidad de
   los diez años, criterio de transferencias (renglón del flujo de efectivo, con el mecanismo de pago
   diferido del artículo 643 de la Ley 16.170 explicado una sola vez, objeción 6), que no hay
   capitalizaciones del Estado en 2015-2024 (objeción 14), la metodología de impuestos pagados, el
   patrón de los segmentos (ingreso, no resultado —objeción 9— con el crecimiento de datos y móvil y
   la caída de telefonía fija que el lector no iba a inferir solo) y la advertencia de reexpresiones
   contables entre balances (objeción 10). Cierra con qué tiene reservado ANTEL hoy y los dos lados
   del debate del monopolio, en una oración cada uno.
5. **Cuatro citas corregidas por no ser contiguas**, encontradas corriendo `pnpm validar --inbox --red`
   (con `--solo citas` para poder aislar mi lote del error ajeno de `content/medios/ose.yaml`, ver
   más abajo):
   - `monopolio.normas[3]` (Ley 17.524): la cita pegaba el título de la norma directamente al
     artículo, saltando el bloque de "Promulgación/Publicación/Registro" que el documento tiene en
     el medio. Releída con `pnpm fuente`; ahora cita solo el artículo, que sí es contiguo.
   - `analisis.yaml` afirmaciones 0 y 2 (balance de ANTEL 2012, comparativo 2011): la cita cortaba
     justo antes de "Gastos Operativos" y "Resultado Operativo", así que el footnote "(*) Incluye
     Telefonía Fija, Pública y Telegrafía" quedaba pegado a un renglón que no es el que le sigue en
     el documento. Releída con `pnpm fuente`; ahora la cita incluye las tres filas completas
     (Ingresos, Gastos, Resultado Operativo) hasta el footnote, que sí es como sigue el documento.
   - `hitos[9]` y `eventos.yaml#1` (Ley 20.075, artículo 240): la cita terminaba en "...acceso a
     internet." con un punto que agregué yo y que el documento no tiene ahí (la oración sigue "a
     través del empleo de sus redes propias..."). Extendida hasta el punto real de la oración, con
     el mismo texto completo que ya estaba bien en `monopolio.normas[6]`.
   - `hitos[5]` (Ley 18.046, artículo 115): mismo error, un punto agregado después de "condiciones
     de exclusividad" que el documento no tiene (sigue "..., con excepción de aquellos servicios de
     carácter social..."). Extendida a la oración completa, igual que en `que_hace_fuentes` y
     `monopolio.normas[4]`, donde ya estaba bien.
   - `monopolio.argumentos_en_contra[2]` (Movistar, En Perspectiva): comillas rectas donde la fuente
     usa comillas tipográficas (" " en vez de “ ”) y un punto final agregado que la fuente no tiene
     (la frase sigue con el párrafo siguiente, de Claro). Corregido carácter por carácter contra el
     texto releído.
   - `finanzas[7].deuda_financiera` (2022): faltaba la referencia de nota "15" antes de la primera
     cifra de "Cuentas por pagar comerciales" del pasivo corriente (estaba en la fila del pasivo no
     corriente pero no en la del corriente). Agregada contra el texto releído.
   Las seis se verificaron de nuevo con `pnpm validar --inbox --red --solo citas`: 138/138 citas
   quedaron "exacta", 0 errores, 0 avisos.
6. **Calificación del análisis de Omar de León** (`analisis.yaml`), regla del Veracímetro:
   - Afirmación 0 (ingresos de telefonía fija 2011, $ 6.229.619.000): **impreciso**. El balance de
     ANTEL de 2012 (columna comparativa 2011), leído por el investigador, da $ 6.232.799 miles para
     la categoría "Telefonía", que agrupa fija, pública y telegrafía —una diferencia de 0,05% y una
     salvedad de categoría que el investigador ya dejó documentada; no llega a "verdadero" sin poder
     aislar la subcategoría exacta, pero el margen es chico y el sentido se mantiene.
   - Afirmaciones 1 (58% de sobreprecio) y 2 (USD 181 millones de renta monopólica): **discutible**
     en las dos. No hay documento oficial (URSEC, UIT, OCDE) que publique el comparador regional que
     De León dice haber usado; la consistencia aritmética entre ambas no sustituye la verificación
     del insumo. Agregué el campo `analisis` de cada una (el investigador no lo había escrito) y el
     `veredicto` del registro completo.
7. **`resumen` de `analisis.yaml` ampliado** (objeción 26, corregir): agregué, en un segundo párrafo
   y con cita propia releída con `pnpm fuente`, los dos datos favorables a ANTEL que trae la misma
   nota de El Observador (Uruguay barato en minuto de celular e internet frente a la región) y que
   ANTEL respondió con una gráfica sobre la baja del precio de la telefonía fija. Es la aplicación de
   la Regla 0: no se saca de una nota solo lo que va para un lado.
8. **`inbox/empresas/antel/2026-09-07/eventos.yaml` creado**, con dos eventos
   (`monopolio-antel-fibra-optica-2012` y `apertura-datos-cableoperadores-2022`), cada uno con fuente
   primaria releída en esta sesión. Sin esto, los cinco registros de `cobertura.yaml` que trajo el
   crítico —que usaban `evento: "propuesto: <id>"`, un placeholder explícito porque el evento no
   existía— no iban a poder promoverse: la referencia hubiera quedado rota. Es trabajo nuevo, no una
   corrección sobre el crudo, pero necesario para no perder el trabajo de tono que ya hizo el crítico.
9. **`cobertura.yaml` y `discrepancias.yaml` copiados del crítico a la carpeta del lote**, con estos
   cambios: los `evento: "propuesto: ..."` de las 5 notas emitibles se resolvieron contra los ids
   reales del punto 8; las 3 notas `no_emitibles` del original no se promueven, tal como el propio
   crítico las dejó marcadas (no nombran político ni partido); a la discrepancia le agregué el campo
   `evidencia` (`nivel: textual`, con la fuente de IMPO y la cita del medio), que el esquema exige y
   el crítico no escribe; a los 6 registros les agregué `revision.tier: publicado` y
   `_investigacion: {modelo: "claude-opus-5[1m]"}` (sin esto, `pnpm promover` no tiene de dónde sacar
   el modelo de estos registros, que son del crítico, no míos).
10. **Tiers asignados**: `empresas.yaml` → `publicado`, con `notas_internas` listando lo que queda
    abierto (ver "Objeciones que quedaron abiertas" abajo); `analisis.yaml` → `publicado`;
    `cobertura.yaml` (5) → `publicado`; `discrepancias.yaml` (1) → `publicado`. Ningún registro de
    este lote necesita aprobación humana: no hay casos, no hay giros `cambio_total + sin_explicacion`,
    no hay fuentes `verificacion: manual`.

## Objeciones de la crítica que quedaron abiertas (no bloqueantes, documentadas en `notas_internas`)

- **27** (Speedtest, fuente primaria): no se pudo abrir `speedtest.net/global-index` (panel
  interactivo sin texto extraíble); la comparación queda con Presidencia como única fuente.
- **28** (solo 2 comparaciones en 11 años): no se agregaron series de URSEC, UIT, Cable.co.uk ni
  `catalogodatos.gub.uy`. El foco de esta vuelta fue cerrar lo bloqueante (citas rotas, criterio
  individual/consolidado); esto queda para una próxima corrida, tal como ya lo anotaba `notas.md`.
- **18.1 y 18.4** (sentencia de la SCJ de 2016, resolución del directorio de 2024): siguen constando
  solo por cobertura de prensa. La Base de Jurisprudencia Nacional exige navegador y `pnpm fuente` no
  la lee; la resolución de 2024 no tiene texto original ubicado.
- **23** (simetría de argumentos): quedó 3 a favor contra 4 en contra. La versión taquigráfica del
  debate parlamentario de la Ley 20.075, que emparejaría el número de una sola vez, no se pudo ubicar
  en el sitio del Parlamento.

Ninguna de estas cuatro es `bloquea` en la crítica original, y ninguna deja una afirmación sin
respaldo o mal atribuida: son profundidad pendiente, no error. Por eso el tier queda en `publicado`
con la salvedad escrita en `notas_internas`, en vez de `probable`.

## Objeción de la crítica que no compete a este lote

- **Objeción al brief, punto 1**: el crítico observa que el brief le daba la respuesta al
  investigador antes de leer las normas ("...y, según la ley de medios y decretos, el tendido de
  fibra al hogar..."). El investigador ya no repitió ese encuadre (`notas.md`, `objeciones_al_brief`):
  `monopolio.alcance` describe lo que las normas dicen hoy, incluida la fibra ya no reservada desde
  octubre de 2022. No hay nada que yo tenga que corregir sobre el crudo por esto; queda para que el
  mantenedor ajuste la redacción del brief en la próxima ficha de empresa.

## Sin hipótesis abiertas

Los seis puntos de `notas.md` bajo `## hipotesis` (decreto de 2012-2013 no encontrado, resolución de
2024 sin texto original, Cámara de Telecomunicaciones bloqueada por Cloudflare, sentencia de la SCJ
sin texto, versión taquigráfica no ubicada, balance de 2011 sin OCR) son huecos de fuente, no
afirmaciones sin probar sobre una persona o una entidad. No corresponden al formato de
`hipotesis/<politico>/<slug>.yaml` (que exige evidencia a favor y en contra sobre una hipótesis
sustantiva); quedan documentados en `notas_internas` de la ficha y en este archivo para que una
próxima corrida los retome.

## Un error ajeno a este lote, encontrado en el camino

`content/medios/ose.yaml` (de una corrida distinta, `2026-09-07-empresas-ose`, que dejó ese archivo
sin la ficha de empresa que promete) hizo fallar `pnpm validar --inbox` en la etapa de referencias.
No lo toqué: no es de este lote. Usé `--solo citas` y `--solo fuentes` (ambos con `--red`) para
verificar mi propio lote sin depender de esa etapa; en el momento de cerrar este informe el error ya
no aparecía en una corrida limpia de `pnpm validar` (aparentemente otra sesión en paralelo lo
resolvió). Lo dejo anotado por si vuelve a aparecer.

## Cambios de forma

- Restituido el paréntesis de cierre y otras erratas menores de puntuación en citas de tipo de
  cambio, ya hechas por el investigador en la segunda vuelta (objeción 2); no las reproduzco acá
  porque ya están descritas en `notas.md`, punto 2 de `para_el_editor`.
- Ninguna otra corrección de forma mía además de las seis citas listadas arriba en el punto 5 (que
  son de fondo, no de forma: cambian si la cita pasa o no la verificación).

## Mensaje de commit propuesto

```
ANTEL: ficha de empresa pública, análisis de la renta monopólica de De León y cobertura del debate del monopolio [corrida 2026-09-07-empresas-antel]
```
