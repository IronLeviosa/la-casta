# Brief: corrección 2026-09-16-correccion-batlle-lectura-chequeos-2000-2002

Comando: /correccion. Carpeta: inbox/correcciones/batlle-lectura-2026-09-16. Pedido literal: inbox/correcciones/batlle-lectura-2026-09-16/pedido.md (cinco puntos).

Los cinco registros del pedido están copiados tal cual desde content/ a la carpeta (sin procedencia, con _slug para que el id derivado sea el mismo): declaraciones.yaml (1: la del 2002-05-30) y chequeos.yaml (4: los dos del 2002-05-30 y los dos del 2000-11-21). Se leen con pnpm lote listar / ver, nunca enteros. `pnpm validar --inbox` puede marcar «posible duplicado» porque son los mismos registros publicados: es esperable en una corrección.

Referencias en content/ a estos ids: los dos chequeos del 2002-05-30 apuntan a la declaración del 2002-05-30 (`declaracion:`). Ninguna otra. Si la fecha de esa declaración cambia, cambian su id y el de los dos chequeos (un chequeo lleva la misma fecha y precisión que su declaración): va con `reemplaza:`, y `pnpm lote fijar` reescribe las referencias dentro de la carpeta.

Banco (pnpm banco, los cinco ids): sin evidencia guardada para ninguno.

Reglas que aplican: docs/colecciones/correcciones.md, docs/colecciones/chequeos.md, docs/colecciones/declaraciones.md («Cómo se fecha») y docs/colecciones/presentacion.md.

Las dos trampas (docs/colecciones/correcciones.md):
- La segunda fuente falsa: una nota que respalda el hecho pero no contiene la cita del registro no se suma a evidencia.fuentes.
- Lo que el pedido afirma sobre el registro se verifica contra el registro y contra la fuente: leer los campos reales y abrir las fuentes con pnpm fuente (--buscar) antes de aceptar cada premisa. El pedido puede tener razón en unos puntos y no en otros; cada punto se resuelve por separado y los tres desenlaces se publican.

Sin pnpm inventario, pnpm sesion:indexar ni nada que consulte el CDX de Wayback (la IP está sensible hasta nuevo aviso).
