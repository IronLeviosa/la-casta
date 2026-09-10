# Razones — corrección 2026-09-10-anp-fuente-caida-pedido-informes-colonia

- `fuentes[]` del pedido de informes al MTOP sobre la profundidad de los puertos de Colonia: `url`
  pasa del enlace temporal caído (HTTP 404, 2026-09-10) a la URL estable de la Hemeroteca del mismo
  diario (`2002-10-09 - DIARIO DE SESIONES DE LA CAMARA DE REPRESENTANTES (0062).pdf`); `fecha` pasa
  de `2026-01-01` (ficticia, el enlace temporal no la declaraba) a `2002-10-09`; `retrieved_at` a
  la fecha de la corrección. La cita se cotejó contra el texto del documento nuevo con `pnpm fuente
  --buscar`. Ningún otro campo cambia.
