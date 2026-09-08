# Razones — edición de la corrida 2026-09-07-empresas-ose

Modelo: **claude-sonnet-5**, por decisión del mantenedor (2026-09-07): el editor corre en Sonnet;
Opus queda reservado para el crítico. Un solo lote (`inbox/empresas/ose/2026-09-07/`), un solo registro
de `empresas` más `cobertura.yaml` (5) y `discrepancias.yaml` (1).

## Contexto: qué llegó ya resuelto

La segunda vuelta del investigador (después de `critica.md`) ya había resuelto la mayoría de las
objeciones `bloquea` y `corregir` antes de que yo abriera el lote: reemplazó los dos argumentos en
contra bloqueados (Delgado, REDES-AT) por Jorge Batlle 2004 y Juan Dubra 2012, completó las citas de
`que_hace`, del artículo 47 y de `normas[1]`, sacó la composición accionaria de Uragua no respaldada,
cargó `deuda_financiera` 2022-2024 con la Nota 8.1, agregó los `segmentos` "Otros" de 2018 y 2019, y
amplió `comparaciones` con el promedio de la muestra del BID, la tarifa social y dos comparaciones de
servicio de ADERASA. Verifiqué cada uno de esos cambios contra el archivo antes de dar por resuelta la
objeción; no encontré ninguno mal aplicado. Lo que sigue es lo que hice yo, con el motivo y, cuando
corresponde, la objeción de `critica.md` que resuelve.

## Cambios de criterio (no triviales)

1. **`monopolio.alcance` recortado de 15 líneas a 3 oraciones** sobre qué está reservado por ley (art.
   47, Ley 11.907/17.277, concesión de Maldonado rescindida en 2005); la narrativa de Arazatí y las
   posiciones de cada lado quedaron en `argumentos_a_favor`/`argumentos_en_contra` (ya cargados con
   fuente) y en `hitos`. Resuelve la objeción `corregir`/`presentacion` de `critica.md` sobre `alcance`
   ("campo sin fuentes propias… reducir a tres o cuatro oraciones").
2. **`hitos[]` agregado** con los ocho hitos que el crítico ya había armado con fuentes ya leídas por el
   lote (creación 1952, Ley 17.277, reforma de 2004, rescisión de Uragua 2005, primer año segmentado
   2018, denuncia CNDAV de Neptuno/Arazatí 2022, respuesta de Delgado 2022, emergencia hídrica 2023).
   Para el hito de Delgado y el de la emergencia hídrica volví a leer las fuentes con `pnpm fuente` en
   esta sesión (Telenoche y la Nota 11 del balance 2023) porque la única versión disponible era
   `cita_de_contexto` de `critica.md`, que no se copia como cita. Resuelve la objeción `corregir` sobre
   `hitos[]` ausente.
3. **`resumen` escrito de cero** (7 párrafos): qué es y qué hace OSE, resultado del ejercicio con el
   dominio de la diferencia de cambio, impuestos y la única transferencia a Rentas Generales del
   período (2023, en sentido empresa→Estado, no al revés, en el año de la emergencia hídrica), deuda y
   capitalizaciones, qué segmento pierde con el descargo del prorrateo, las comparaciones de tarifa y
   de servicio con el mismo peso, y los dos lados del artículo 47. Pedido del brief.
4. **Lenguaje de pipeline sacado de cinco `nota`** (2017, 2019, 2021, 2022, 2024: "en el texto
   disponible", "problema de extracción del PDF", "texto extraído", "no consultada en esta corrida") y
   de un `concepto` (resultado_ejercicio 2019, que citaba "notas.md, anios_sin_balance"). Reescrito en
   términos que el lector entiende sin conocer el pipeline, sin afirmar más de lo que se sabe (no digo
   "OSE no publicó" cuando lo que sé es que la nota no está en la parte consultada). Resuelve la
   objeción `corregir`/`presentacion` de `critica.md`, sección **(f)**.
5. **Imagen agregada**: fachada del edificio de OSE en Montevideo (Wikimedia Commons, Andrea Mazza, CC
   BY 3.0, verificado con `pnpm fuente` que la licencia es la que declara la página), bajada con
   `pnpm imagen` en una resolución de 460 KB (la primera baja, de 2,9 MB, quedó en el ledger sin usar
   porque el propio comando avisó que era pesada para una página).
6. **Cuatro medios creados en `content/medios/`** (no en `inbox/.../medios/`): `ose.yaml`, `bid.yaml`,
   `aderasa.yaml`, `foco-economico.yaml`. El brief de esta tarea pedía escribirlos dentro de
   `inbox/empresas/ose/2026-09-07/medios/`, pero seguí lo que dice `.claude/agents/editor.md` ("La
   única parte de `content/` que sí escribís… `content/medios/`… sin eso el lote no valida y nadie más
   lo va a hacer") y lo que confirma el propio esquema: `crearMedioSchema` no lleva `procedencia`, y
   `CLAUDE.md` lista `medios` entre las colecciones que se commitean por "semilla", no a través de
   `pnpm promover`. Corrida `pnpm validar --inbox` después del cambio: los 68 errores de referencia
   por medios inexistentes (`ose` ×64, `aderasa` ×2, `bid` ×1) desaparecieron con los archivos en
   `content/medios/`, lo que confirma que ahí es donde el validador los busca. Si el mantenedor prefiere
   el otro camino, son cuatro archivos chicos y se mueven en un minuto; lo dejo dicho para que decida.
   No creé `content/medios/redes-org-uy.yaml`: el investigador ya sacó a REDES-AT del lote en la
   segunda vuelta (ver `notas.md`), así que no hace falta.
7. **`eventos.yaml` nuevo en el inbox** con `proyecto-arazati` y `crisis-hidrica-2023`, siguiendo el
   pedido explícito de la tarea ("si calzan… escribilos en `eventos.yaml` del lote"). Los dos calzan en
   `src/schemas/evento.ts`: fechas ISO completas, un tema válido (`medioambiente`; agregué también
   `empresas-publicas` en el primero), políticos ya referenciados en `cobertura.yaml`
   (`lacalle-pou`, `delgado`), resumen de 2-3 oraciones con cada afirmación en las fuentes que ya
   estaban en el lote (más Telenoche y la Nota 11, releídas en esta sesión). Actualicé el campo
   `evento` de los cinco registros de `cobertura.yaml` para que apunten al id real (`proyecto-arazati`,
   `crisis-hidrica-2023`) en lugar del marcador `"propuesto: …"` del crítico, porque decidí crearlos;
   `pnpm validar --inbox` resolvió esas referencias contra el `eventos.yaml` del propio inbox sin que
   yo tuviera que tocar `content/eventos/`.
8. **Tier `publicado`** para la ficha de `empresas.yaml`, para los 5 registros de `cobertura.yaml` y
   para el registro de `discrepancias.yaml`. Las tres objeciones `bloquea` de `critica.md`
   (`argumentos_en_contra[0]`, `argumentos_en_contra[1]` y la falta de un lado del monopolio que se
   derivaba de las dos) están resueltas desde la segunda vuelta del investigador. Quedan dos huecos
   documentados que no llegué a cerrar del todo: `capitalizaciones_del_estado` sin verificar en 2015 y
   2017-2021 (6 de 10 años; el renglón está congelado en los años sí verificados) y
   `transferencias_al_estado` sin dato en 2019, 2021 y 2022 (esos balances no traen la nota en la parte
   consultada; verificado que "Rentas Generales" no aparece en el texto de 2021 ni 2022, así que no es
   falta de búsqueda). Apliqué el mismo criterio que ya está escrito en
   `content/empresas/ancap.yaml` (que también quedó `publicado` con huecos documentados de la misma
   naturaleza — serie de PPI sin extender, un segmento no verificable, un decreto sin número
   confirmado — en vez de degradar todo el registro por partes que no se pudieron cerrar): un hueco
   buscado y declarado no es lo mismo que un hueco no buscado, y degradar a `probable` un registro de
   391 sub-registros de este nivel de cuidado por dos huecos residuales aplicaría un umbral distinto
   al que ya se le aplicó a ANCAP. Los dos huecos quedan en `revision.notas_internas` y mencionados en
   el `resumen` (transferencias) para que el lector no confunda "sin dato" con "no hubo".
9. **No toqué "fuentes repetidas" (la cotización del dólar como segunda fuente)**, que el crítico marcó
   `aviso` y pidió aplicar el mismo criterio a `content/empresas/ancap.yaml`. Cambiarlo solo en OSE
   dejaría dos fichas de la misma colección con dos convenciones de citado distintas, que es
   exactamente lo que el crítico objeta; queda anotado en `notas_internas` para una decisión de
   conjunto sobre la colección `empresas`, no de este lote.
10. **No investigué el caso judicial de Arazatí** (medida cautelar del juez Recarey en 2024, revocada
    después por el Tribunal de Apelaciones): está fuera del alcance del brief de esta corrida (no hay
    pedido explícito de investigar casos) y el propio `notas.md` ya lo dejó así. Lo dejo anotado en
    `notas_internas` para que quede a la vista si una corrida futura decide cubrirlo como caso.

## Bloqueo externo, no de este lote

`pnpm validar --inbox … --red` no llegó a la etapa de citas: un archivo sin trackear,
`content/medios/antel.yaml` (con `empresa: antel`, que no existe en `content/empresas/`), rompe la
etapa de referencias para todo el árbol de `content/`. No es un archivo mío ni de esta corrida — no lo
creé, no lo edité, y el ficha `content/empresas/antel.yaml` que referencia no existe, lo que indica una
corrida de ANTEL en curso en paralelo (otra sesión, no esta). No lo toqué porque no es mío para tocar.
Con ese archivo aparte, `pnpm validar --inbox inbox/empresas/ose/2026-09-07` corre limpio: **0 errores
de esquema, 0 errores de referencia propios de este lote** (386 archivos, 391 registros). Verifiqué a
mano, releyendo el archivo, cada cita que agregué o que acorté de una cita ya existente en el lote
(todas son sub-cadenas contiguas y literales de texto ya citado en el mismo archivo o releído esta
sesión con `pnpm fuente`); no pude correr la comparación automática contra el corpus por el bloqueo de
arriba.

## Cambios de forma

- Ninguno más allá de lo listado arriba: no encontré fechas mal escritas ni erratas de tipeo en lo que
  edité.
