# Plan: el grupo de un medio tiene fecha

Escrito el 2026-09-16 desde la sesión que decide (Fable). Lo dispara el crítico de las resoluciones de Astori: `content/medios/el-observador.yaml` dice `grupo: werthein-hochbaum`, pero ese grupo controla el diario desde el 5 de mayo de 2022; toda nota de El Observador anterior a esa fecha que hoy cuenta como «segundo grupo» de un registro `reportado` se está contando con un grupo que no era el suyo. Lo mismo vale para cualquier medio que cambió de dueño (Canal 10, radios, portales).

## Qué hay hoy

- `src/schemas/medio.ts`: `grupo` es un string único; `propiedad.descripcion` cuenta la historia en prosa, sin fechas por tramo que una máquina pueda usar.
- La regla de independencia (`CLAUDE.md`, «reportado: dos fuentes de distinto grupo») se evalúa con el grupo actual del medio, sin mirar la fecha de la nota.

## Decisión

El grupo se declara por tramos con fecha, y el validador evalúa cada fuente con el grupo que el medio tenía **en la fecha de esa nota**. Nada se adivina: un tramo sin fuente no vale, y un medio sin historia documentada antes de cierta fecha tiene grupo `desconocido` en ese tramo, que cuenta como un grupo propio (no coincide con nadie) pero deja aviso.

### Esquema (`src/schemas/medio.ts`)

```yaml
grupo: werthein-hochbaum            # el vigente, como hoy (lo usa el sitio y sigue siendo obligatorio)
grupo_historial:                    # nuevo, opcional; si falta, `grupo` vale para siempre
  - grupo: peirano
    desde: 1991-10-22
    hasta: 2022-05-04
    fuentes: [ … ]                  # misma forma que `propiedad.fuentes`
  - grupo: werthein-hochbaum
    desde: 2022-05-05
    fuentes: [ … ]
```

- Tramos ordenados, sin solaparse; el último puede no tener `hasta`. `grupo` (el actual) tiene que ser el del último tramo.
- Un tramo puede llevar `grupo: desconocido` con `fuentes` vacío solo si `descripcion` de `propiedad` dice qué se buscó y no se encontró.

### Validador

- Donde se evalúa «dos fuentes de distinto grupo» (buscar la regla de `reportado` en `scripts/validadores/`), el grupo de cada fuente es `grupoEnFecha(medio, fuente.fecha)`: el tramo que contiene la fecha; sin `grupo_historial`, el `grupo` actual. Fecha fuera de todo tramo → `desconocido` con aviso «la fecha de la nota cae fuera de la historia de propiedad documentada del medio».
- `desconocido` nunca coincide con otro grupo ni consigo mismo (dos notas `desconocido` del mismo medio siguen siendo una sola fuente; de medios distintos, se aceptan como dos grupos con aviso).
- Aviso de alineamiento compartido: mismo criterio, por fecha, solo si `alineamiento` también gana historial; si no, como hoy.

### Sitio

- Ficha del medio (`/medios/<slug>/`): la propiedad como línea de tiempo por tramos, con sus fuentes plegadas, en vez de la prosa sola.
- Página de un registro: el grupo que se muestra junto a cada fuente es el de la fecha de la nota.

### Barrido

Con el validador en su lugar, `pnpm validar` sobre `content/` lista solo los registros `publicado` de nivel `reportado` cuya independencia dependía de un grupo mal fechado. Ese listado es el lote de una corrección de tipo `cambio_de_rating` (a `probable` con `_faltante: segunda_fuente`) para todos los que caigan, de cualquier persona, y trabajo del resolvedor después. Nadie elige a mano cuáles.

## Orden de ejecución

1. Datos primero (main): un investigador documenta la historia de propiedad de El Observador por tramos con fuente; corrección de `medios/el-observador` que llena `grupo_historial`. Mientras el esquema no exista, la corrección espera con el lote armado.
2. Taller: esquema, `grupoEnFecha`, validador, ficha del medio, tests con un medio de dos tramos y notas antes y después del cambio.
3. Merge, `pnpm validar` sobre `content/`, y la corrección de barrido con lo que salga.
4. Después, el mismo pedido para todo medio con cambio de dueño documentado en `propiedad.descripcion` (buscar «desde», «vendió», «adquirió» en `content/medios/*.yaml`).

## Qué no hacer

- No cambiar `grupo` de El Observador a `peirano` «para arreglar lo viejo»: rompería lo nuevo.
- No revisar a mano «los registros de Astori con El Observador»: la lista sale del validador para todos.
