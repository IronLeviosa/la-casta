# Razones — corrección Argimón/Cosse (crítica de 2026-09-05-vicepresidentes-fichas-2015-2030)

Modelo: claude-sonnet-5 (brazo barato del experimento; el encargo pidió correr esta corrección en
Sonnet, no en Fable como marca la tabla de modelos por rol. Queda dicho para el registro del
experimento).

## Búsqueda por persona (mismo esfuerzo, resultado distinto)

**Argimón:** releí el cuerpo completo del artículo de Wikipedia con `pnpm fuente --buscar` (dos
ventanas, "INAME | Edila | directora del INAME | Edil" y la lista de referencias), después
`WebSearch` para encontrar coberturas alternativas de su biografía, y abrí dos de ellas con
`pnpm fuente`: Montevideo Portal (2019-11-28, "Un repaso a la vida de Beatriz Argimón") y Teledoce
(nota de video con solo 201 caracteres de texto extraíble, sin dato útil). Tres fuentes abiertas en
total sobre el punto puntual del INAME/Edila.

**Cosse:** abrí con `pnpm fuente` la nota de Montevideo Portal del día de la asunción
(2025-03-01) que ya tenía identificada la propia crítica, y además busqué y abrí una fuente nueva
para la Intendencia (Subrayado, 2020-11-26) que no estaba en la crítica ni en el lote original. Dos
fuentes nuevas abiertas y usadas.

La diferencia de resultado (a Argimón no se le pudo agregar nada al registro; a Cosse sí) es
porque el problema de Argimón es de precisión de fecha en la fuente misma (ningún medio que
encontré da día y mes del cargo en el INAME), no de falta de búsqueda. Para Cosse el problema
señalado por la crítica no era de fecha sino de variedad de sourcing, y ahí sí hay de sobra: la
asunción de un gobierno es la nota más cubierta del calendario político uruguayo.

## Caso 1 — `politicos/argimon` — sin cambios en el registro publicado

La crítica (severidad `corregir`, tipo `asimetria`) señala que el cargo de Directora del INAME
durante la presidencia de Lacalle Herrera (1990-1995) está documentado en el cuerpo del artículo de
Wikipedia y no entró ni a `mandatos` ni a `notas.md` como hipótesis, a diferencia de la Edilía de
Topolansky y la Dirección de TI de Cosse, que sí quedaron anotadas en su momento.

Reabrí la fuente y confirmé el cargo: "Durante el período presidencial del presidente nacionalista
Luis Alberto Lacalle fue directora del INAME (Instituto Nacional del Menor; actual INAU)."
(https://es.wikipedia.org/wiki/Beatriz_Argim%C3%B3n). El mismo artículo, en el párrafo anterior,
agrega que "tras 30 años de militante ha tenido cargos como Edila de Montevideo y Representante
Nacional", y que "cuatro meses después de egresar de la Universidad de la República fue candidata a
Edila de Montevideo en las elecciones de 1989" — no queda claro en el cuerpo del artículo si esa
candidatura de 1989 es la misma que la llevó a ejercer como edila, o si hay otra elección
posterior. Busqué una segunda fuente para acotar la fecha: Montevideo Portal (2019-11-28) repite
los mismos dos datos con las mismas palabras ("tras 30 años de militante ha tenido cargos como
edila y diputada de la República" / "Durante el período presidencial del nacionalista Luis Alberto
Lacalle fue directora del INAME") y tampoco da día ni mes. Teledoce (entrevista biográfica) no
aportó texto legible.

Ninguna de las tres fuentes da una fecha con precisión de día (`YYYY-MM-DD`, como exige el
esquema de `mandatos`). Por instrucción explícita del encargo, ante esa situación no se agrega el
cargo al registro. Se aplica el mismo criterio que ya se usó, en la corrida original, para la
Edilía de Topolansky (1995-2000, solo años) y la Dirección de TI de Montevideo de Cosse
(2007-2010, solo años): en ningún caso entran a `mandatos` por falta de precisión, y en ningún caso
hay una fuente que dé el día exacto.

La asimetría que señaló la crítica no era de criterio (el criterio es correcto y ahora se aplica
igual a las tres) sino de que, para Argimón, esa decisión no había quedado escrita en ningún lado.
Queda escrita acá. El registro de `politicos/argimon` no cambia: sigue siendo el mismo que está
publicado hoy. Por eso `politicos/argimon` sale de `afecta` en
`content/correcciones/2026-09-05-argimon-cosse-fuentes.yaml`.

Si en el futuro aparece una fuente con la fecha exacta (Diario Oficial, IMPO, o el propio archivo
de INAU/INAME), corresponde una corrección nueva del tipo `error_factual` u homóloga, agregando el
mandato.

## Caso 2 — `politicos/cosse` — se agregan dos fuentes de prensa

La crítica (severidad `corregir`, tipo `asimetria`) señala que la única fuente no-Wikipedia de
Cosse era el pie de un enlace de descarga de JUTEP, la sourcing más débil del lote para el hecho
más reciente y más cubierto por la prensa de las cuatro personas: su asunción como vicepresidenta
el 1° de marzo de 2025.

Se agregó, al mandato de "Vicepresidente de la República", una segunda fuente de prensa que narra
el hecho mismo de la asunción: Montevideo Portal, 1/3/2025, "Yamandú Orsi asumió la Presidencia a
40 años del retorno de la democracia en Uruguay", con la cita "Ambos se dirigieron a la Asamblea
General, donde el presidente, Alejandro Sánchez, inició la ceremonia de toma de Compromiso de Honor
Constitucional. Así, ambos fueron proclamados presidente y vicepresidenta de la República." Se
mantiene la fuente de JUTEP, que sigue siendo válida como documento oficial que confirma el cargo
vigente, solo que ahora no es la única fuente no-Wikipedia del mandato.

Aprovechando que el encargo pide mejorar "si se puede" el resto de sus cargos, se buscó y agregó
también una fuente de prensa para el mandato de Intendenta de Montevideo (que hasta ahora
dependía solo de Wikipedia): Subrayado, 26/11/2020, "Carolina Cosse asumió como intendenta de
Montevideo y anunció detalles de su programa de gobierno", con la cita "Carolina Cosse asumió este
mediodía como intendenta de Montevideo." No se buscó reforzar los mandatos de ANTEL y del
Ministerio de Industria: la crítica no los señaló como débiles y el encargo pedía mejorar primero
"su asunción" (que ya quedó resuelta) y después, si se podía, el resto; se priorizó cerrar el punto
más señalado antes de seguir buscando en cargos no objetados.

Los dos medios agregados (montevideo-portal, subrayado) ya existen como slugs en
`content/medios/`; no hizo falta anotar ningún medio faltante.

## Regla 0

Las dos personas son de partidos distintos (Argimón, Partido Nacional; Cosse, Frente Amplio). Se
aplicó la misma pregunta a las dos ("¿hay una fuente con fecha exacta para el cargo objetado?" /
"¿hay más prensa disponible sobre el punto señalado?") y la misma cantidad de fuentes nuevas
abiertas (tres para Argimón, dos para Cosse, más una consulta de `WebSearch` cada una). El
resultado distinto (un registro cambia, el otro no) responde a que la propia crítica ya señaló
razones distintas para cada una — precisión de fecha en un caso, variedad de sourcing en el
otro — y no a que se haya buscado más para una que para la otra.

## Objeciones de la crítica que no se resuelven acá

- El hueco de 14 días entre el fin de la vicepresidencia de Topolansky (2020-02-14) y el inicio de
  la de Argimón (2020-03-01): la propia crítica aclara que no es un error sino el calendario
  constitucional (jura de la Legislatura el 15 de febrero, del Ejecutivo el 1° de marzo) y pide una
  nota general en `content/eventos/` o `content/paginas/`, no una corrección a estos dos registros.
  Fuera del alcance de este encargo (no toca `politicos/argimon` ni `politicos/cosse` en su
  contenido; es un punto de documentación general del sitio).
- La duda `renuncia`/`renuncia_forzada` de Sendic y la fecha exacta de asunción de Argimón como
  embajadora en París: no son objeto de este encargo (no afectan a `politicos/argimon` en el campo
  de mandatos vicepresidenciales, que es lo que se corrige acá) y quedan como estaban.
- La sugerencia de abrir hipótesis formales sobre INAME/Edilía de Argimón: no se escribió un
  archivo en `hipotesis/` porque el encargo pidió específicamente agregar el mandato o, si no se
  podía, dejarlo anotado en este `razones.md` — que es lo que se hizo. Si se quiere una hipótesis
  formal en `hipotesis/argimon/` para que quede en la cola de trabajo del detective, es un paso
  adicional que no pidió el encargo; lo dejo señalado por si se quiere.

## Validación

Se corrió `pnpm validar --inbox inbox/correcciones/vicepresidentes-fichas/2026-09-05 --red`. Ver
salida al pie del informe.
