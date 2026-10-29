# Brief: historia de propiedad de El Observador (corrección de medios/el-observador)

Corrida: 2026-10-29-correccion-el-observador-grupo-historial. Carpeta: inbox/correcciones/el-observador-grupo-historial (medios.yaml con la ficha publicada copiada tal cual, _id el-observador). Plan: docs/plan-grupo-por-fecha.md. Reglas: docs/colecciones/medios.md (sección «grupo_historial»), ejemplo en docs/ejemplos/medio.yaml.

## Por qué

La ficha publicada dice `grupo: werthein-hochbaum`, el grupo que controla el diario desde el 5 de mayo de 2022. Sin `grupo_historial`, el validador usa ese grupo para toda fecha, así que cualquier nota de El Observador anterior a 2022 citada como «segundo grupo» de un registro `reportado` se cuenta con un dueño que no era el suyo. Esto no es sobre ninguna persona ni partido: afecta a todo registro, de cualquiera, que cite El Observador antes de 2022, y el listado de los afectados lo va a dar el validador, no esta corrida.

## Qué se busca

La historia de propiedad de El Observador desde su fundación (22 de octubre de 1991) hasta el 5 de mayo de 2022, en tramos con fecha, cada uno con al menos una fuente con cita literal leída con `pnpm fuente`:

- Quién controlaba la sociedad editora en cada período: fundadores, socios, accionistas que entraron o salieron, ventas parciales, fusiones o cambios de razón social. No basta con «fundado por Ricardo Peirano»: hace falta saber si Peirano (o su familia) fue el controlante todo el período o si hubo otros socios de control, y desde y hasta cuándo.
- El tramo que termina el 4 de mayo de 2022 y el vigente desde el 5 ya tienen una fuente en la ficha (la nota «El Observador cambia de accionistas»); confirmá con ella la fecha de corte y si dice quién vendió.
- Fuentes preferidas, en este orden: documentos oficiales (Diario Oficial, registros de sociedades, resoluciones públicas), la propia empresa (notas institucionales, aniversarios, «quiénes somos»), notas de terceros de otro grupo de medios que documenten la propiedad, estudios académicos o de organizaciones sobre concentración de medios en Uruguay. Wikipedia sirve como pista, no como única fuente de un tramo.
- Corpus primero (`pnpm corpus:buscar … --consultas data/corridas/2026-10-29-correccion-el-observador-grupo-historial/consultas.jsonl`), después la web. Una URL armada a mano no se abre: se abre lo que da el buscador, el corpus o el sitemap.

## Qué escribís

- En `inbox/correcciones/el-observador-grupo-historial/medios.yaml`, registro 0, el campo `grupo_historial` con `pnpm lote fijar` (para textos largos, `--desde-archivo` con un archivo `_*.yaml` en la misma carpeta): tramos ordenados por `desde`, sin solaparse, todos salvo el último con `hasta`, el último con `grupo: werthein-hochbaum` (tiene que coincidir con `grupo`). Cada tramo con `fuentes` de la misma forma que `propiedad.fuentes`.
- El slug de cada grupo sale de la propiedad documentada (ej. `peirano` si el controlante fue Ricardo Peirano o su familia). Si un grupo ya existe en otra ficha de `content/medios/`, usá el mismo slug.
- Un período en el que de verdad buscaste y no encontraste quién controlaba: `grupo: desconocido`, `fuentes: []`, y lo decís en `propiedad.descripcion`. Nunca se rellena un tramo por suposición.
- Podés actualizar `propiedad.descripcion` para que cuente la historia por tramos, con lo que las fuentes sostienen. No toques `alineamiento`, `grupo` ni los demás campos.
- Lo que no alcanzaste a probar, con el motivo, en `inbox/correcciones/el-observador-grupo-historial/notas.md` (`pnpm lote notas … --agregar`).
- Cierre: `pnpm validar --inbox inbox/correcciones/el-observador-grupo-historial --red --breve`.

No asignás tier, procedencia ni etiqueta legal. Sin `pnpm inventario`, `pnpm sesion:indexar` ni nada que consulte el CDX de Wayback. El mismo umbral de evidencia que se le exigiría a la ficha de cualquier otro medio.
