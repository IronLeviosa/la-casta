# Perfiles de medios (`content/medios/`)

Una ficha por medio citado: qué es, de quién es (`propiedad`), a qué familia de propiedad pertenece (`grupo`) y qué alineamiento documentado tiene. Es una colección de referencia, pero no es decorativa: la regla de dos grupos para `reportado` y el aviso por alineamiento compartido se calculan con lo que dice esta ficha, y por eso ningún registro puede citar un `medio` que no exista. Un medio nuevo se documenta en la misma corrida que lo cita; no se espera a nadie.

## Campos

`_slug` (el slug con el que las fuentes lo citan: el dominio sin puntos, `frenteamplio-uy`, `el-pais`, `la-diaria`), `nombre`, `tipo` (`diario | semanario | portal | tv | radio | agencia | estatal | enciclopedia`), `grupo` (familia de propiedad; dos medios del mismo grupo cuentan como uno), `url`, `dominios[]`, `alias[]`, `empresa` (solo si es el medio de una empresa pública con ficha), `propiedad: {descripcion, fuentes[]}`, `alineamiento: {etiqueta, justificacion, fuentes[]}`, `revision.tier`. Ejemplo completo en `docs/ejemplos/medio.yaml`. La procedencia la escribe `pnpm promover`.

## Investigación

- **Un medio que no está en `content/medios/` no frena la corrida.** El investigador escribe su ficha en `medios.yaml` del mismo lote, con el `_slug` exacto que usan sus fuentes, y `pnpm validar --inbox` la resuelve como si ya estuviera publicada; `pnpm promover` la publica con la corrida y con procedencia. Hasta el 2026-09-15 dos fuentes de un medio sin ficha pararon un lote de 22 registros porque nadie tenía camino para darlo de alta. `medios_faltantes` en `notas.md` queda solo para lo que no se pudo documentar: un medio del que no se encontró fuente ni para la propiedad ni para el alineamiento.
- **`propiedad` y `alineamiento` llevan fuente con cita literal leída con `pnpm fuente`**: la página «quiénes somos» o «acerca de», el registro de la sociedad, la nota de un tercero que documenta al dueño, o la autodefinición del propio sitio. Sin fuente, `alineamiento.etiqueta: sin_datos` y la `justificacion` dice qué se buscó y no se encontró. Nunca se infiere de la línea editorial ni se adivina.
- **Sitio de un partido, de un sector o de una campaña**: `tipo: portal`, `grupo` = el partido, `alineamiento` por autodefinición (`progresista` para el Frente Amplio y sus sectores, `oficialista_tradicional` para los partidos Nacional y Colorado y los suyos), y la `propiedad` dice explícitamente que es fuente primaria de lo que el partido o el candidato dijo y que **nunca cuenta como segunda fuente independiente**. El tratamiento es el mismo para todos los partidos: `mpp` y `lacallepou-uy` son el precedente y se copian.
- **Organismo público** (Presidencia, Parlamento, BCU, una intendencia): `tipo: estatal`, `alineamiento.etiqueta: estatal`, y `propiedad` dice qué organismo es.
- **El `grupo` sale de la propiedad documentada, no del nombre**: dos diarios del mismo dueño llevan el mismo grupo aunque compitan; un portal y una radio de la misma familia también.

## Edición

El editor no crea medios ni los inventa: revisa que la ficha del lote tenga fuentes para las dos secciones y que la etiqueta sea la misma que recibiría el sitio equivalente de otro partido. Un perfil ya publicado cambia solo por corrección (`docs/colecciones/correcciones.md`).

## Crítica

Ficha con `alineamiento` sin fuente o inferido de la línea editorial en vez de documentado; un sitio partidario etiquetado distinto que su equivalente de otro partido; un medio nuevo usado como segunda fuente de otro del mismo grupo; `grupo` que no coincide con la propiedad documentada; un `_slug` que no es el que usan las fuentes del lote.
