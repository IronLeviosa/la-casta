# Razones — corrección hierro-lopez / embajada en Perú

Corrida de origen del error: `2026-09-04` (o antes) → detectado por la crítica de
`data/corridas/2026-09-05-vicepresidentes-fichas-2000-2015/critica.md`, objeción sobre
`politicos[0]` (hierro-lopez), mandatos[5] y estado_actual, severidad `bloquea`.

## Cambios de fondo

1. **`mandatos[5].hasta` y `estado_actual.salida.fecha`: 2022-12-07 → 2025-06-17.**
   Motivo: las dos fuentes que sostenían el `2022-12-07` no prueban un cese.
   - El Observador (2022-12-07) dice literalmente "el exvicepresidente de la República y
     **actual** embajador uruguayo en Perú, Luis Hierro López" — documenta que ese día seguía
     en el cargo, no que lo dejó. Leerla como respaldo del cierre es leerla al revés (objeción
     de la crítica, punto 1).
   - La Wikipedia en inglés ("In office 22 March 2021 – 7 December 2022") es la única fuente
     no-Wikipedia... en realidad es la única fuente que da esa fecha de cierre, y está
     desmentida por la Wikipedia en español (leída en la misma sesión: "Actualmente en el
     cargo Desde el 9 de diciembre de 2020", sin fecha de fin) y por Subrayado (25-10-2023, que
     lo sigue llamando embajador en funciones casi un año después de la fecha que tenía la
     ficha).
   Busqué la fecha real con `pnpm fuente` y `WebSearch`. Until now no existe un decreto o
   comunicado con el día exacto, pero hay dos fuentes independientes, ninguna Wikipedia, que
   documentan que el 17-18 de junio de 2025 la Cancillería peruana y el Congreso peruano le
   hicieron una despedida oficial dando su gestión por concluida:
   - Andina (agencia estatal peruana), 17-6-2025: "el embajador Hierro, cuya gestión
     diplomática concluye luego de más de cuatro años de servicio".
   - EFE (republicada en eldiario.es), 18-6-2025 (la ceremonia fue "este martes", 17-6-2025):
     "al término de sus cuatro años de labor diplomática en Perú".
   Una entrevista posterior (La Razón, Perú, 5-7-2025: "Tras culminar su misión diplomática en
   el Perú...") ya lo describe en pasado, así que el cese ocurrió entre el 17-6-2025 y el
   5-7-2025. No usé La Razón como fuente del registro porque no encontré una fuente citable y
   verificable sobre quién es su propietario actual (hay un "La Razón" limeño de 1919 y otro de
   los años 90 de Moisés Wolfenson, y no pude confirmar si el sitio larazon.pe de hoy es la
   continuación de alguno de los dos); por la misma regla que aplico a cualquier medio nuevo,
   no lo agrego a `content/medios/` sin esa fuente, así que tampoco lo cito como fuente del
   dato. Uso 2025-06-17 (la fecha de la ceremonia) como `hasta`/`salida.fecha` por ser la más
   precisa y documentada, no porque sea necesariamente su último día formal en el cargo — de
   ahí el tier `probable`.

2. **Se agregó `content/medios/andina-peru.yaml`** (nuevo). Necesario para citar la fuente que
   documenta la fecha corregida. Propiedad: agencia de noticias oficial del Estado peruano,
   propiedad de la empresa pública Editora Perú (fuente: Wikipedia, "Andina (Perú)").
   Alineamiento: `estatal` (agencia oficial del gobierno peruano de turno).

3. **La cita de El Observador (2022-12-07) se conserva en `mandatos[5].fuentes`** pero ya no
   se usa en `estado_actual.salida.fuentes`. Sigue siendo evidencia legítima de que Hierro
   López era embajador en esa fecha (parte de la línea de tiempo del cargo), solo se sacó como
   respaldo del cierre, que es lo que la crítica pidió (punto (c) de la acción sugerida).

4. **Tier: `publicado` → `probable`.** El día exacto del cese no tiene un documento oficial
   (decreto, resolución o comunicado de Cancillería) que lo fije; solo hay un acto público
   fechado que lo da por concluido. `revision.que_falta` lo dice para el lector;
   `revision.notas_internas` deja el rastro completo para quien continúe, incluyendo el dato de
   que la sucesora (Silvana Montes de Oca) recién asumió el 20-10-2025, lo que sugiere un
   interinato en el medio que esta ficha no resuelve.

## Cambios de forma

- Ninguno: no se tocó nombre, alias, partido, wikidata, foto ni los otros cinco mandatos. Se
  revisaron sus citas contra las fechas exactas (ver informe): ninguna otra cita contradice lo
  que se le hace decir, a diferencia del caso corregido. Una de ellas (el primer mandato,
  Representante Nacional) usa un fragmento del cuerpo del artículo que no incluye el día exacto
  (solo "1984" y "reelecto en 1989"), en vez de la línea del infobox con día y mes; no es una
  contradicción, es una imprecisión menor que ya existía antes de esta corrección, no se
  encontró tema del brief de esta corrección y no se tocó.

## Simetría (Regla 0)

El mismo criterio que se aplicó acá (no aceptar una cita que dice lo contrario de lo que se le
hace decir; buscar la fecha real en vez de conservar la que ya estaba; bajar a `probable`
cuando la fecha encontrada no es 100% precisa) es el que correspondería aplicar a Argimón o
Cosse si alguna de sus fichas tuviera el mismo tipo de error — no se tocaron esas fichas porque
están asignadas a otros editores en paralelo, no por el partido de la persona.
