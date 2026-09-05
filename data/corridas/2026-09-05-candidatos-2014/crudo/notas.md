# Notas — candidatos a la Presidencia, elección de 2014

Nota de alcance: este brief pide una semilla de fichas base (`content/politicos`), no una
corrida de declaraciones. Por eso varias de las secciones fijas de este archivo (giros,
hipótesis, verificación manual, cobertura del período en términos de declaraciones) no
aplican y quedan vacías; el resto de esta nota documenta el trabajo propio de una corrida
de identidad/candidatura.

## Criterio aplicado y resultado completo

Fuente: Wikipedia, "Elecciones generales de Uruguay de 2014" (tabla "Resultados
presidenciales oficiales", Corte Electoral), primera vuelta del 26 de octubre de 2014 y
balotaje del 30 de noviembre de 2014. Umbral: al menos 1 banca (Senado o Diputados) para
el lema encabezado por la persona.

| Candidato a la Presidencia | Lema | Votos (1ª vuelta) | % | Senado | Diputados | ¿Entra? |
|---|---|---|---|---|---|---|
| Tabaré Vázquez | Frente Amplio | 1.134.187 | 47,81 % | 15/30 | 50/99 | Sí — ganó el balotaje |
| Luis Lacalle Pou | Partido Nacional | 732.601 | 30,88 % | 10/30 | 32/99 | Sí — perdió el balotaje |
| Pedro Bordaberry | Partido Colorado | 305.699 | 12,89 % | 4/30 | 13/99 | Sí — no llegó al balotaje |
| Pablo Mieres | Partido Independiente | 73.379 | 3,09 % | 1/30 | 3/99 | Sí — no llegó al balotaje |
| Gonzalo Abella | Unidad Popular | 26.869 | 1,13 % | 0/30 | 1/99 | Sí — no llegó al balotaje |
| César Vega | Partido Ecologista Radical Intransigente (PERI) | 17.835 | 0,75 % | 0/30 | 0/99 | **No** — 0 bancas |
| Rafael Fernández Rodríguez | Partido de los Trabajadores | 3.218 | 0,13 % | 0/30 | 0/99 | **No** — 0 bancas |

Los cinco primeros entran en este lote. César Vega (PERI) y Rafael Fernández Rodríguez
(Partido de los Trabajadores) quedan afuera de la corrida de 2014 porque sus lemas no
obtuvieron ninguna banca en esa elección puntual, aplicando el mismo umbral que en 2019 y
2024. Ninguno de los dos "pesó" en el resultado más allá de ese 0,75 % y 0,13 %
respectivamente.

César Vega ya tiene ficha propia (`cesar-vega`, creada en el lote de 2019, donde su lema sí
obtuvo 1 banca en Diputados). No se tocó esa ficha ni se le agregó una candidatura de 2014,
porque en 2014 no cumple el umbral de este lote puntual.

Nota sobre las fórmulas: solo se investigó y fichó al candidato a la Presidencia que
encabezó cada lema (el brief pide explícitamente "candidatos que encabezaron un lema"). Los
candidatos a la Vicepresidencia que lo acompañaron (Raúl Sendic, Jorge Larrañaga, Germán
Coutinho, Conrado Ramos, Gustavo López) no se fichan en este lote.

## Personas ya cargadas: de dónde salió cada base

- **Tabaré Vázquez** (`vazquez`): solo existía en `content/politicos/vazquez.yaml`
  (publicado). No tiene versión pendiente en los lotes de 2019 ni 2024. Se copió entero y
  se le agregó: (1) un mandato que faltaba y que no tiene relación con 2014 pero que el
  brief pide completar — Intendente de Montevideo, 5 de mayo de 1990 al 5 de mayo de 1995,
  con fuente en su propia ficha de Wikipedia (infobox); y (2) la candidatura de 2014.

- **Luis Lacalle Pou** (`lacalle-pou`): existe en DOS lugares con contenido distinto.
  `content/politicos/lacalle-pou.yaml` (publicado) solo tiene el mandato de Presidente
  2020-2025. `inbox/candidatos/2019/2026-09-05/politicos-existentes.yaml` tiene una versión
  bastante más completa (Diputado 2000-2015, Presidente de la Cámara 2011-2012, Senador
  2015-2019, Presidente 2020-2025, y ya con la candidatura de 2019) que todavía no fue
  promovida. Usé la versión del inbox de 2019 como base, no la de `content/`, porque es
  estrictamente más completa y evita perder ese trabajo ya hecho; documento esto acá para
  que el editor decida cuál versión promover primero. Le agregué la candidatura de 2014
  antes de la de 2019 (orden cronológico). No encontré mandatos adicionales que faltaran.

- **Pablo Mieres** (`mieres`): existe publicado en `content/politicos/mieres.yaml`, con
  candidatura de 2024. También hay un registro con el mismo slug en
  `inbox/candidatos/2019/2026-09-05/politicos.yaml` (como ficha "nueva", no como
  "existente"), que quedó sin promover — es un duplicado parcial del mismo tipo de problema
  que este brief pide evitar, ya generado antes de este lote. No lo usé como base porque
  `content/politicos/mieres.yaml` (publicado, con procedencia de la corrida
  `2026-09-05-candidatos-2024`) es la versión vigente y más reciente en el tiempo real de
  publicación. Verifiqué contra el infobox de su Wikipedia que no le falta ningún mandato
  documentado (Director de Educación 1995-1996, Representante 2000-2005, Senador
  2015-2020, Ministro de Trabajo 2020-2024 — coincide exactamente). Le agregué la
  candidatura de 2014 antes de la de 2024.

## Personas nuevas

- **Pedro Bordaberry** (`bordaberry`): sin ficha previa en ningún lugar. Ficha nueva con
  sus mandatos documentados (dos ministerios entre 2002 y 2005, Senador 2010-2020, Senador
  2025-presente) y la candidatura de 2014. También fue candidato a la Presidencia en 2009
  (ganó la interna colorada y perdió la elección general, quedando electo senador); no
  incluí esa candidatura en `candidaturas` porque excede el alcance de este lote (2014) y
  queda para quien haga la corrida de 2009.

- **Gonzalo Abella** (`abella`): sin ficha previa en ningún lugar. Nunca ejerció un cargo
  electivo ni de gobierno (maestro rural, escritor e historiador); `mandatos: []`, permitido
  por el esquema. Ficha nueva solo con la candidatura de 2014. También fue candidato de
  Unidad Popular en 2019 (misma fórmula con Gustavo López), que no se incluyó por la misma
  razón de alcance.

## Fuentes no-Wikipedia por persona

Mismo esfuerzo de búsqueda (corpus + WebSearch con filtros `site:`) para los cinco.
Encontré una nota de El Observador ("Los debates y su cuestión de oportunidad",
2014-08-29) que menciona por nombre, en el contexto de la campaña de 2014, a los cuatro
candidatos de los partidos tradicionales y del Partido Independiente (Vázquez, Lacalle
Pou, Bordaberry, Mieres), y la usé como fuente no-Wikipedia para los cuatro. Para
Lacalle Pou también usé una segunda nota de El Observador (2019-02-06) específica sobre su
derrota de 2014. Para Abella usé "Los partidos pequeños" (El Observador, 2014-04-19), que
lo cita textualmente como candidato de Unidad Popular.

| Persona | Fuentes no-Wikipedia encontradas y usadas |
|---|---|
| Vázquez | 1 (El Observador, 2014-08-29) |
| Lacalle Pou | 2 (El Observador, 2014-08-29 y 2019-02-06) |
| Bordaberry | 1 (El Observador, 2014-08-29) |
| Mieres | 1 (El Observador, 2014-08-29) |
| Abella | 1 (El Observador, 2014-04-19) |

No encontré, a pesar de buscar con filtros `site:` sobre El País, El Observador, La Diaria
y Montevideo Portal, una nota de noche de elecciones (26/10 o 30/11 de 2014) de esos medios
que siga accesible y descargable con `pnpm fuente`; las notas de esa fecha que aparecen en
buscadores son sobre todo de medios extranjeros (Diario de Cuyo, La Nación, NODAL, Fox
News) que no están en `content/medios/`, por lo que no se usaron.

## Fechas imprecisas

Ninguna. Todas las fechas de mandatos y candidaturas de este lote se documentaron con día
exacto.

## Gaps en `data/alias.yaml`

- **Unidad Popular** (Gonzalo Abella) no está en la lista de partidos de
  `data/alias.yaml`. Se usó igual como `partido` porque es su nombre real y no hay alias
  más cercano; falta agregar una entrada de partido para que el etiquetado del corpus lo
  reconozca.

## candidatos_giro

Ninguno. Este lote no investiga declaraciones.

## hipotesis

Ninguna. Este lote no investiga declaraciones.

## casos_vistos

Ninguno. No apareció ningún caso judicial de pasada en la investigación de este lote.

## verificacion_manual

Ninguna. Todas las páginas citadas se leyeron con `pnpm fuente` sin errores.

## cobertura_del_periodo

No aplica en el sentido de declaraciones/gestión: este lote cubre identidad y candidatura
de 2014, no un período de declaraciones. Cobertura de mandatos: completa para los cinco
según lo documentado en Wikipedia (infobox verificado persona por persona); la única
laguna deliberada es no completar candidaturas de otras elecciones (2009 de Bordaberry,
2019 de Abella) por quedar fuera del alcance de este brief.

## objeciones_al_brief

Ninguna asimetría que corregir: el umbral (al menos 1 banca) se aplicó igual a los cinco
lemas, de derecha, centro e izquierda, sin excepción, y a los dos que quedaron afuera
(PERI y Partido de los Trabajadores) con el mismo criterio.

Un matiz, no una objeción de Regla 0: el brief pide fichar solo a quien encabezó el lema
("candidatos que encabezaron un lema"), y esa instrucción es simétrica porque se aplica
igual a las cinco fórmulas — tampoco se fichó a los candidatos a la Vicepresidencia
(Sendic, Larrañaga, Coutinho, Ramos, López) por igual. No hay asimetría entre partidos en
ese recorte, solo un recorte de alcance parejo.
