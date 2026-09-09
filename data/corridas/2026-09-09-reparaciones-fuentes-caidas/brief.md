# Corrida 2026-09-09-reparaciones-fuentes-caidas

Reparaciones mecánicas de fuentes caídas, hechas desde el chat (`/revisar`) y no por un agente investigador. Cada reparación es una corrección de tipo `fuente_caida` en `content/correcciones/`: reemplaza una URL que dejó de responder por la URL estable del mismo documento, sin tocar la cita ni lo afirmado, y `pnpm validar --red` verifica que la cita siga en el texto del documento nuevo antes de promover.

## Regla

Solo se cambia la URL (y `archived_url` / `retrieved_at`). Si la cita no está en el documento de la URL nueva, no es una reparación: se abre una corrección de otro tipo.

## Reparaciones

- `empresas/anp`: las dos citas de la interpelación al ministro Heber (24.ª sesión extraordinaria del Senado, 18 de agosto de 2021) apuntaban a `infolegislativa.parlamento.gub.uy/temporales/20210818s0024.pdf`, un enlace temporal que caducó (HTTP 404). La URL estable es la de la Hemeroteca de la Biblioteca del Poder Legislativo, `biblioteca.parlamento.gub.uy/Publicaciones/sesionescss/2021-08-18 - DIARIO DE SESIONES DE LA CAMARA DE SENADORES (0024).pdf`.
