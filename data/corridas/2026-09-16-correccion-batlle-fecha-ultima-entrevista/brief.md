# Brief: corrección 2026-09-16-correccion-batlle-fecha-ultima-entrevista

Comando: /correccion. Carpeta: inbox/correcciones/2026-09-16. Pedido literal: inbox/correcciones/2026-09-16/pedido.md.

Los diez registros del pedido ya están copiados tal cual desde content/ a la carpeta (sin procedencia, con _slug para que el id derivado sea el mismo): declaraciones.yaml (2), menciones.yaml (4), chequeos.yaml (4). Se leen con pnpm lote listar / ver, nunca enteros. `pnpm validar --inbox` marca «posible duplicado» porque son los mismos registros publicados: es esperable en una corrección y no se resuelve cambiando los registros.

Banco (pnpm banco, los diez ids): sin evidencia guardada para ninguno.

Reglas que aplican: docs/colecciones/correcciones.md y la sección «Cómo se fecha» de docs/colecciones/declaraciones.md.

Las dos trampas (docs/colecciones/correcciones.md):
- La segunda fuente falsa: una nota que respalda el hecho pero no contiene la cita del registro no se suma a evidencia.fuentes. Esta corrección no agrega fuentes.
- Lo que el pedido afirma sobre el registro se verifica contra el registro: leer la fecha, el título, el resumen y la cita reales, y abrir la fuente con pnpm fuente (--buscar) para confirmar si dice o no cuándo se hizo la entrevista, antes de aceptar la premisa.

Alcance: solo fecha_precision y, si algún texto para el lector presenta la fecha como cierta al día, ese texto. No cambia tiers, calificaciones, fuentes ni ids. Si la fuente da la fecha de la entrevista, no se aplica la corrección: se informa.
