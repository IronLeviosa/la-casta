# Razones — edición del lote candidatos/2024/2026-09-05

Modelo: claude-sonnet-5 (brazo barato del experimento; el encargo pidió correr el rol de editor en
Sonnet, no en Fable como marca la tabla de modelos por rol. Queda dicho para el registro del
experimento, en `EXPERIMENTO.md`).

Corrida: `data/corridas/2026-09-05-candidatos-2024/`. Nota: `critica.md` había marcado `bloquea` la
ausencia de `brief.md` en esa carpeta; al releerla para este encargo el archivo ya está presente
(con una nota del mantenedor explicando que se reconstruyó después de la corrida), así que esa
objeción de lote ya está resuelta y no requirió acción de mi parte.

## Objeción 1 (`corregir`) — Delgado, cinco fechas de precisión de año/mes

Abrí `https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta` con `pnpm fuente --forzar` (no confié
en los valores que la crítica dejó escritos: los verifiqué en el texto propio). El bug de mojibake
ya no está; el infobox, leído en esta sesión, dice textualmente "Inspector General del Trabajo 1 de
marzo de 2000-15 de diciembre de 2004", "Representante Nacional de Uruguaypor Montevideo 15 de
febrero de 2005-15 de febrero de 2015" y, para el primer período de senador, "15 de febrero de
2015-01 de marzo de 2020" (este último fragmento no repite la etiqueta "Senador de la República"
porque el infobox la comparte con el segundo período de 2025, listado antes en el HTML; el rango de
fechas es igual de contiguo y verificable). Los tres valores coinciden exactamente con los que
proponía la crítica, pero llegué a ellos por mi propia lectura, no por copia.

Cambios: `mandatos[0].desde` `"2000"`→`2000-03-01`, `.hasta` `"2004"`→`2004-12-15`; `mandatos[1].desde`
`"2005"`→`2005-02-15`, `.hasta` `"2015"`→`2015-02-15`; `mandatos[2].desde` `"2015"`→`2015-02-15`
(`.hasta` ya estaba en `2020-03-01` y coincide con la fuente). Agregué la Wikipedia de Delgado como
fuente adicional en los tres mandatos (no reemplaza a Subrayado, Teledoce ni al PDF del Parlamento,
que quedan como corroboración independiente, tal como pedía la acción sugerida de la crítica).

## Objeción 2 (`corregir`) — Manini Ríos, cita que no dice "senador"

Reabrí el artículo de Ámbito sobre el veto de agosto de 2024. Confirmé que el texto es continuo
desde "el líder de Cabildo Abierto, Guido Manini Ríos, se mostró sorprendido..." hasta "...apuntó el
senador y añadió...", sin cortes. Extendí la cita del mandato de Senador hasta "apuntó el senador"
(tramo contiguo, sin puntos suspensivos ni fusión de oraciones separadas). Ahora la cita, por sí
sola, sostiene el cargo que se le atribuye a esta fuente.

## Objeción 3 (`corregir`) — Mieres, cargo faltante (Director de Educación, MEC)

Reabrí `https://es.wikipedia.org/wiki/Pablo_Mieres` y confirmé la oración: "Durante 1995 y 1996,
ocupó el cargo de Director de Educación en el Ministerio de Educación y Cultura, manteniéndose
políticamente independiente." Agregué el mandato "Director de Educación (Ministerio de Educación y
Cultura)", `desde: "1995"`, `hasta: "1996"` (la fuente no da mes ni día; el validador lo acepta como
aviso, no como error). Mismo tratamiento de precisión que ya recibía el cargo de Inspector General
del Trabajo de Delgado antes de esta edición: cuando la única fuente da solo el año, se publica con
precisión de año, no se inventa el mes.

## Hallazgo del crítico ya resuelto en el registro (Delgado, fecha de renuncia 2025)

Verifiqué de forma independiente el punto que el crítico dejó sin acción porque el registro ya
estaba bien. Rastreé la nota [8] de la Wikipedia de Delgado, que sostiene "El 21 de julio renunció a
su banca en el Senado": la referencia real es «Álvaro Delgado anunció que renunciará al Senado para
estar full time como presidente del directorio blanco». El Observador. Consultado el 22 de julio de
2025.» — un título en futuro ("anunció que renunciará"), consultado un día antes del supuesto hecho
consumado. Es un anuncio, no la renuncia efectiva. El registro de este lote usa El Observador
2025-08-05 ("Álvaro Delgado presentó este martes su renuncia al Senado para dedicarse de lleno a su
nuevo rol de presidente del Partido Nacional."), que sí describe el trámite del día. No cambié nada
en `mandatos[4].hasta` ni en `estado_actual.salida` (ambos ya en `2025-08-05`): confirmo que la
fecha y la cita ya sostenían lo correcto y que "corregir" esto contra la Wikipedia, como advertía la
crítica, lo habría empeorado.

## Tier

Aplico a los cinco el mismo criterio que a presidentes y vicepresidentes: cada mandato con al menos
una fuente (lo exige el esquema y lo cumplen los cinco) y cada persona con al menos una fuente que
no sea Wikipedia. Los cinco cumplen esto último desde antes de mis cambios (Delgado 7, Ojeda 1,
Manini Ríos 1, Mieres 2, Salle 1 fuentes no-wiki únicas; ver detalle abajo). No hay chequeos, casos
ni giros en este lote que exijan compuerta humana. Asigno `revision: {tier: publicado}` a los cinco
registros. No subí ni bajé a nadie por el partido: Partido Nacional, Partido Colorado, Cabildo
Abierto, Partido Independiente e Identidad Soberana quedan con el mismo resultado (`publicado`) por
el mismo motivo.

## Candidaturas — verificación de que no se rompió nada

Los cinco bloques `candidaturas` (resultado `no_electo` para los cinco, `detalle` y `votos` contra
la tabla de la Corte Electoral vía Wikipedia) no los toqué. Los releí después de mis ediciones para
confirmar que siguen intactos: los cinco conservan `cargo`, `fecha`, `lema`, `resultado`, `detalle`
y `votos` sin cambios.

## Regla 0 — reparto de fuentes por persona (después de mis cambios)

| Persona | Mandatos | Fuentes no-Wikipedia (únicas) | Fuentes Wikipedia (únicas) |
|---|---|---|---|
| Delgado | 5 | 7 (subrayado, teledoce, la-diaria, ambito, el-observador×2, parlamento PDF) | 2 |
| Ojeda | 2 | 1 (búsqueda) | 1 |
| Manini Ríos | 2 | 1 (ambito) | 1 |
| Mieres | 4 | 2 (presidencia, parlamento diario de sesiones) | 1 |
| Salle | 1 | 1 (el-observador) | 1 |

El reparto sigue desparejo (Delgado muy por encima del resto), y ya estaba así antes de mi edición.
La propia `notas.md` de la corrida explica por qué: la Wikipedia de Delgado se descargó corrupta
(mojibake) durante la investigación original, y el investigador tuvo que reconstruir toda su
cronología con prensa uruguaya y un documento oficial en su lugar, en vez de apoyarse en el infobox
como pudo hacer con los otros cuatro. Confirmé el bug yo mismo al reabrir la página con `--forzar`
(objeción 1, arriba): hoy se lee bien, y el crítico ya había reproducido el mismo problema antes de
que se arreglara. Para Ojeda, Manini Ríos, Mieres y Salle —los cuatro que hay que mirar según pide
el encargo— el esfuerzo fue parejo: notas.md documenta el mismo método (corpus → ficha de
Parlamento → una nota de prensa uruguaya) para los cuatro, y donde alcanzó con una sola fuente
no-wiki fue porque esa nota ya confirmaba el dato sin ambigüedad, no porque se buscara menos. No
hice búsquedas adicionales de fuentes no-wiki para estos cuatro en esta sesión (mi tarea era
resolver las tres objeciones puntuales y verificar tier, no ampliar sourcing no objetado); si se
quisiera emparejar más el reparto, el camino sería un `resolvedor` sobre estos cuatro registros, no
una edición de criterio.

## Objeciones del crítico que quedan sin resolver (y por qué)

- **Ojeda — aviso, cita de Búsqueda débil.** La lista de nombres del Partido Colorado ("Partido
  Colorado Andrés Ojeda, Gustavo Zubía...") es contigua con el encabezado "La nueva composición del
  Senado", pero solo si se incluye también la lista completa del Frente Amplio y del Partido
  Nacional que separa a ambos (revisé el texto completo: no hay un tramo más corto en todo el
  artículo que junte "senadores" con el nombre de Ojeda). Extender la cita para incluir el
  encabezado hubiera significado citar ~800 caracteres de nombres de otros partidos para ganar una
  palabra. No lo hice: es un aviso, no un `corregir`, y el mandato ya tiene como fuente principal el
  infobox de Wikipedia con precisión de día ("Senador de la República... Desde el 15 de febrero de
  2025"), que sí prueba el cargo sin ambigüedad.
- **Manini Ríos — aviso, falta fuente para la comparación con 2019.** La crítica sugiere agregar
  `es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019` como fuente del dato comparativo
  en `candidaturas[0].detalle` ("de tres senadores a ninguno..."). No lo agregué: el encargo de esta
  sesión listaba tres objeciones `corregir` y un hallazgo puntual a verificar, y este es un aviso
  sobre un campo (`detalle`) que no tiene su propio arreglo de fuentes en el esquema (las fuentes
  del bloque `candidaturas` respaldan `votos`, no cada cláusula de `detalle`); lo señalo para que
  quede escrito, sin tocarlo.
- **Objeción de lote sobre `cobertura.yaml` y los cinco eventos que le faltan a `content/eventos/`
  para poder promoverlo.** No corresponde a este encargo (no escribo `cobertura.yaml` ni doy de alta
  eventos nuevos salvo que el brief lo pida bajo `medios_faltantes`/`referentes_faltantes`, y no es
  el caso). Queda como lo dejó la crítica.
- **Entrada de `candidaturas` para Orsi, propuesta en `notas.md`.** Requiere
  `content/correcciones/` + `pnpm promover --correccion`, que no es un paso del editor sino de
  `/revisar`. No la apliqué.

## Validación

`pnpm validar --inbox inbox/candidatos/2024/2026-09-05 --red` → 0 errores, 13 avisos (2 de precisión
de fecha en el mandato nuevo de Mieres, esperados y aceptados por el esquema; 1 de URL caída del
diario de sesiones de Mieres, resuelta por la copia archivada; 1 de cita aproximada 0.97 en la
biografía del Parlamento de Delgado, preexistente y no tocada en esta sesión; el resto son avisos de
cobertura temática a nivel de sitio, no de este lote). Corrida repetida hasta confirmar 0 errores.
