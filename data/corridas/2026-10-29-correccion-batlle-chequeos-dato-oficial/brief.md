# Brief: corrección 2026-10-29-correccion-batlle-chequeos-dato-oficial

Comando: /correccion. Carpeta: inbox/correcciones/batlle-chequeos-dato-oficial-2026-10-29. Pedido literal: inbox/correcciones/batlle-chequeos-dato-oficial-2026-10-29/pedido.md (cinco registros). Origen: el resolvedor sobre los chequeos de Batlle que seguían en probable con `_faltante: dato_oficial` (brief del resolvedor: data/corridas/2026-10-29-resolucion-chequeos-batlle/brief.md); su salida, un archivo por chequeo, está en la carpeta como `_resolucion-*.yaml`.

Los cinco registros están copiados tal cual desde content/ a la carpeta (chequeos.yaml, sin procedencia, con _slug para que el id derivado sea el mismo; `pnpm lote comparar` contra content/ dio cinco «igual»). Se leen con `pnpm lote listar / ver`, nunca enteros. `pnpm validar --inbox` puede marcar «posible duplicado» porque son los mismos registros publicados: es esperable en una corrección. Ninguna otra pieza de content/ apunta a estos cinco ids salvo la corrección 2026-09-16-presentacion-narracion-barrido-simetrico (historial).

Banco (pnpm banco, los cinco ids): sin evidencia guardada para ninguno.

Qué se decide: por registro, qué evidencia nueva entra y dónde (dato_real.fuentes, análisis), si la calificación cambia y qué tier le corresponde con las reglas de docs/colecciones/chequeos.md. Un solo lote y una sola corrección con los cinco ids en `afecta[]`; para el que no tiene nada nuevo, igual, con la constancia de qué se buscó en `notas.md`. La crítica se centra en el chequeo 1 (déficit fiscal 2003-2013): los documentos oficiales dan 3,0 / 3,2 / 3,1% para 2003 y ninguno da 2,8%; el crítico pesa si eso cambia la lectura del chequeo y qué cifra oficial manda, y pesa también las fuentes de cada resolución contra su registro.

Reglas que aplican: docs/colecciones/correcciones.md, docs/colecciones/chequeos.md, docs/colecciones/presentacion.md.

Las dos trampas (docs/colecciones/correcciones.md):
- La segunda fuente falsa: un documento que respalda el hecho pero no contiene la cifra o la cita que el registro afirma no se suma a las fuentes del dato: pasaría la validación de red sin sostener lo que el registro dice. Cada cita nueva se abre con pnpm fuente --buscar y se lee en su contexto: un cuadro del Presupuesto con otro perímetro o un newsletter de contexto no es el dato que falta.
- Lo que el pedido afirma sobre el registro se verifica contra el registro y contra la fuente: el resolvedor es un agente, no una persona con la última palabra. Leer los campos reales y abrir las fuentes antes de aceptar cada premisa (por ejemplo, la premisa de que la Memoria BCU 2003 «sí tiene texto legible» y la de que 2003 fue 3,0 / 3,2 / 3,1%). Cada registro se resuelve por separado y los tres desenlaces se publican.

Sin pnpm inventario, pnpm sesion:indexar ni nada que consulte el CDX de Wayback (la IP está sensible hasta nuevo aviso).
