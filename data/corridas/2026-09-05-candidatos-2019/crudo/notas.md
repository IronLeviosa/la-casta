# Notas — semilla candidatos a Presidencia 2019

## Candidatos a la Presidencia en 2019, votos y bancas, y el corte del umbral

Fuente para toda esta sección: `https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2019`
(que cita a la Corte Electoral), leída con `pnpm fuente` en esta sesión.

Resultados de primera vuelta, 27 de octubre de 2019 (votos, % y bancas obtenidas
Senado/Diputados):

| Candidato | Lema | Votos | % | Senadores | Diputados |
|---|---|---|---|---|---|
| Daniel Martínez | Frente Amplio | 949.376 | 39,02 % | 13/30 | 42/99 |
| Luis Lacalle Pou | Partido Nacional | 696.452 | 28,62 % | 10/30 | 30/99 |
| Ernesto Talvi | Partido Colorado | 300.177 | 12,34 % | 4/30 | 13/99 |
| Guido Manini Ríos | Cabildo Abierto | 268.736 | 11,04 % | 3/30 | 11/99 |
| César Vega | Partido Ecologista Radical Intransigente (PERI) | 33.461 | 1,38 % | 0/30 | 1/99 |
| Edgardo Novick | Partido de la Gente | 26.313 | 1,08 % | 0/30 | 1/99 |
| Pablo Mieres | Partido Independiente | 23.580 | 0,97 % | 0/30 | 1/99 |
| Gonzalo Abella | Unidad Popular | 19.728 | 0,81 % | 0/30 | 0/99 |
| Gustavo Salle | Partido Verde Animalista | 19.392 | 0,80 % | 0/30 | 0/99 |
| Daniel Goldman | Partido Digital | 6.363 | 0,26 % | 0/30 | 0/99 |
| Rafael Fernández | Partido de los Trabajadores | 1.387 | 0,06 % | 0/30 | 0/99 |

Balotaje (24 de noviembre de 2019): Lacalle Pou 1.189.313 (50,79 %) venció a
Martínez 1.152.271 (49,21 %).

**Umbral aplicado (igual para todos los lemas, sin excepción):** entra el candidato
cuyo lema haya obtenido al menos una banca en Senado o Diputados en 2019. Por ese
criterio entran los primeros siete de la tabla (Martínez, Lacalle Pou, Talvi, Manini
Ríos, Vega, Novick, Mieres) — la propia nota de Wikipedia lo confirma en prosa: "7
partidos obtuvieron representación en la Cámara de Representantes: Frente Amplio,
Partido Nacional, Partido Colorado, Cabildo Abierto, Partido Ecologista Radical
Intransigente, Partido de la Gente y Partido Independiente; y fue notorio que otros
dos quedaron fuera por unos pocos miles de votos: el Partido Verde Animalista y la
Unidad Popular".

**Quedan afuera del umbral** (0 bancas en ambas cámaras): Gonzalo Abella (Unidad
Popular, 19.728 votos), Gustavo Salle (Partido Verde Animalista, 19.392 votos),
Daniel Goldman (Partido Digital, 6.363 votos) y Rafael Fernández (Partido de los
Trabajadores, 1.387 votos). Ninguno de los cuatro se acerca al umbral de manera que
amerite una objeción al brief: el corte entre Mieres (1 diputado) y Abella (0 bancas)
es limpio y consistente con el resto de la tabla.

**Ya tenían ficha en `content/politicos/`:** solo Luis Lacalle Pou. Se verificó el
directorio antes de empezar; Manini Ríos y Mieres (que el brief anticipaba que podían
ya estar, "si ya se promovió el lote de 2024") **no** tienen ficha todavía, así que
van en `politicos.yaml` como registros nuevos, no en `politicos-existentes.yaml`.

## Qué se agregó a Lacalle Pou (`politicos-existentes.yaml`)

A la ficha existente (que solo tenía el mandato de Presidente 2020-2025) se le agregó:
- Mandato: Miembro de la Cámara de Representantes por Canelones, 2000-02-15 a
  2015-02-15.
- Mandato: Presidente de la Cámara de Representantes, 2011-03-01 a 2012-03-01.
- Mandato: Senador de la República, 2015-02-15 a 2019-08-12 (renunció para dedicarse
  de lleno a la campaña; hay fuente no-Wikipedia, Teledoce, que lo confirma con esa
  fecha exacta).
- `candidaturas`: la de 2019 (Presidencia, electo en balotaje).

El resto del registro (foto, alias, mandato de Presidente, estado_actual) se copió
igual que en `content/politicos/lacalle-pou.yaml`, sin tocarlo.

## Fuentes no-Wikipedia por persona (mismo esfuerzo de búsqueda para todos)

- Daniel Martínez: Infobae (28/10/2019), sobre el resultado de primera vuelta.
- Ernesto Talvi: Parlamento — Diario de Sesiones de la Asamblea General (21/10/2020),
  aceptación de la renuncia al cargo de canciller.
- Guido Manini Ríos: Parlamento — Diario de Sesiones (01/03/2022), lista de asistencia
  como senador. (También se leyó Montevideo Portal sobre un veto forestal que lo
  menciona como senador, pero esa nota no devolvió fecha de publicación recuperable y
  no se usó como fuente citada; ver `verificacion_manual`.)
- César Vega: Parlamento — Diario de Sesiones (14/06/2022), lista de representantes
  presentes; y Montevideo Portal (18/10/2024) sobre el patrimonio declarado en 2024.
- Edgardo Novick: Subrayado (23/04/2019), nota de campaña.
- Pablo Mieres: Presidencia (gub.uy, 02/05/2024), nota oficial sobre el cambio de
  ministro de Trabajo.
- Lacalle Pou (registro existente, actualización): Teledoce (12/08/2019), sobre la
  renuncia al Senado. Se agrega porque el registro actual en `content/` solo tenía
  fuentes Wikipedia; con este agregado también él queda con al menos una fuente
  no-Wikipedia.

El reparto es parejo: una fuente no-Wikipedia por persona, todas encontradas con el
mismo patrón de búsqueda (corpus primero, después la web para lo que el corpus no
cubría). No hubo ninguna persona con más esfuerzo de búsqueda que otra.

## Precisión de fechas

Todas las fechas de `mandatos` y `candidaturas` en este lote quedaron con precisión de
día (`YYYY-MM-DD`); ninguna tuvo que bajar a mes o año porque en todos los casos
Wikipedia da la ficha de sucesión con fecha exacta y, donde hizo falta corroborar, se
encontró una segunda fuente con la misma fecha exacta (Teledoce, Presidencia,
Parlamento). No hubo que usar la excepción de fecha parcial en este lote.

## Novick: conflicto de esquema (no es un objeción al brief, es un límite del modelo de datos)

Edgardo Novick cumple el umbral de inclusión del brief (su lema, Partido de la Gente,
obtuvo 1 diputado en 2019 — banca que ocupó Daniel Peña, no Novick). Pero Novick nunca
ejerció un cargo electivo ni de gobierno: en 2015 fue candidato a la Intendencia de
Montevideo (segundo más votado, no ganó), y en 2019 y 2024 candidato a la Presidencia
(no electo). No se encontró ningún cargo ejercido, en corpus ni en la web.

El esquema de `politicos` (`src/schemas/politico.ts`) exige `mandatos.min(1)` y, si
`estado_actual.situacion = fuera_de_cargo`, exige un bloque `salida` que describe cómo
dejó "el último cargo relevante" — un cargo que Novick nunca tuvo. No hay manera de
llenar ninguno de los dos campos con datos reales sin inventar un mandato que no
existe, así que no lo hice. El registro de Novick en `politicos.yaml` queda con
`mandatos: []` y `estado_actual: {situacion: fuera_de_cargo}` sin `salida`, a
sabiendas de que `pnpm validar` va a marcar ambos como error.

Esto no es una asimetría de trato: al resto de los seis candidatos que sí cumplen el
umbral se les aplicó exactamente el mismo criterio y la misma profundidad de
búsqueda, y sí tenían cargos documentados. Es Novick el que, por los hechos, no
encaja en un esquema pensado para gente que ejerció cargos. Queda para que el editor
o el mantenedor decidan: relajar el esquema para permitir un `politico` que sea
puramente candidato, o dejar este registro en espera hasta que se resuelva, o tratarlo
como caso aparte. No tomé esa decisión porque no me corresponde.

De paso: el partido "Partido de la Gente" no está en `data/alias.yaml` (sí están
Frente Amplio, Partido Nacional, Partido Colorado, Cabildo Abierto, Partido
Independiente y Partido Ecologista Radical Intransigente). Si se promueve este
registro, falta agregarlo ahí.

## Manini Ríos: "Comandante en Jefe del Ejército" como mandato

Se incluyó "Comandante en Jefe del Ejército Nacional" (2015-2019) como mandato de
Manini Ríos porque el brief pide "TODOS los cargos electivos o de gobierno
documentados" y es un cargo de gobierno (nombramiento presidencial, con cese también
por decisión presidencial), bien documentado con fechas exactas. Es un caso límite
porque no es un cargo político-electivo como el resto de los mandatos de este lote;
si el criterio del proyecto es más estricto que eso, se puede sacar sin que falte
nada más en el registro.

## candidatos_giro

No aplica: esta es una corrida de identidad y candidatura (semilla de la colección
`politicos`), no de declaraciones. No se buscaron declaraciones ni se compararon
posiciones en el tiempo.

## hipotesis

Ninguna que no esté ya cubierta en las secciones anteriores (el conflicto de esquema
de Novick y el caso límite de "Comandante en Jefe" como mandato).

## casos_vistos

- `https://es.wikipedia.org/wiki/Guido_Manini_R%C3%ADos`: la organización Madres y
  Familiares de Uruguayos Detenidos Desaparecidos denunció en 2018 que, siendo
  Comandante en Jefe, dio información falsa sobre la ubicación de restos de
  desaparecidos; esto fue parte de los motivos de su cese en 2019. No investigado más
  allá de lo que apareció de paso en su biografía.
- `https://es.wikipedia.org/wiki/Guido_Manini_R%C3%ADos`: en febrero de 2022 un
  director del Instituto Nacional de Colonización acusó a Manini Ríos, su cónyuge y su
  suegro de ser colono propietario y estar en infracción; Manini presentó un informe
  jurídico que, según la misma nota, mostró la inconsistencia de la acusación. No
  investigado.
- Varios documentos de `parlamento.gub.uy` leídos para confirmar fechas de mandatos
  (listas de asistencia del Senado) traían la etiqueta de corpus `caso-penades`
  (Gustavo Penadés) sin que se haya leído ningún contenido sobre ese caso; se
  menciona solo porque la etiqueta apareció, no porque se haya investigado nada.

## verificacion_manual

- `https://parlamento.gub.uy/camarasycomisiones/legisladores/7081` (ficha oficial de
  Manini Ríos como legislador): la página se renderiza con JavaScript y `pnpm fuente`
  solo devolvió el pie de página (100 caracteres, sin contenido útil). No se usó como
  fuente; la evidencia de su período como senador salió de Wikipedia y de un Diario de
  Sesiones que sí se pudo leer.
- `https://www.montevideo.com.uy/Noticias/Lacalle-veto-la-ley-forestal-porque-la-norma-vulnera-derechos-e-impacta-en-la-economia-uc807480`:
  se leyó con `pnpm fuente` y confirma a Manini Ríos como senador, pero la
  herramienta no devolvió una fecha de publicación (`fecha ?`) y no se encontró la
  fecha exacta del veto forestal en el tiempo disponible. No se usó como fuente citada
  porque el esquema exige `fecha` en cada fuente.

## cobertura_del_periodo

Esta corrida es de identidad y candidatura, no de declaraciones, así que "cobertura
del período" se lee distinto: para cada una de las 6 personas nuevas se cubrieron
todos los cargos documentados en Wikipedia desde el primero (el más antiguo es Pablo
Mieres, diputado suplente desde 1984 y titular desde 2000) hasta el más reciente
(Cabildo Abierto y PERI perdiendo representación en 2024-2025), más la candidatura de
2019 en todos los casos. No se buscó nada posterior a 2025 salvo lo necesario para
confirmar si la persona sigue en el cargo hoy (ninguna de las seis sigue en un cargo
electivo a la fecha de esta corrida). Para Lacalle Pou se completó el tramo
2000-2019 que faltaba en la ficha existente; su mandato presidencial 2020-2025 no se
tocó porque ya estaba.

## objeciones_al_brief

Ninguna. El criterio de inclusión (banca en Senado o Diputados) se aplicó igual a
los siete lemas que lo cumplieron, sin importar su ubicación en el espectro
ideológico, y los cuatro que no lo cumplieron quedan documentados con sus votos en
la primera sección de esta nota, no simplemente omitidos.

## Validación corrida en esta sesión

`pnpm validar --inbox inbox/candidatos/2019/2026-09-05` falla con un solo error: no
reconoce el nombre `politicos-existentes.yaml` (`ARCHIVOS_INBOX` en
`scripts/lib/inbox.ts` solo mapea `politicos.yaml` a la colección `politicos`). Es el
nombre de archivo que el brief pidió explícitamente para separar las personas que ya
tienen ficha de las que no, así que no lo renombré para complacer al validador.

Para confirmar que el contenido de los dos archivos es válido, cada uno se copió a un
directorio temporal como `politicos.yaml` y se corrió `pnpm validar --inbox` por
separado:

- `politicos-existentes.yaml` (Lacalle Pou): 0 errores de esquema, 0 de referencias,
  0 de tiers; solo avisos de cobertura asimétrica esperables (otros políticos sin
  registros en temas donde Lacalle Pou sí tiene).
- `politicos.yaml` (los 6 nuevos): 2 errores de esquema, ambos en el registro de
  Edgardo Novick (`mandatos` vacío y `estado_actual.salida` faltante), exactamente el
  conflicto de esquema documentado más arriba. Los otros cinco registros (Daniel
  Martínez, Talvi, Manini Ríos, Vega, Mieres) pasan sin errores.

Si se ejecuta `pnpm promover` sobre esta corrida, quien lo corra va a tener que
decidir aparte qué hacer con `politicos-existentes.yaml` (aplicarlo como corrección
sobre `content/politicos/lacalle-pou.yaml`, ya que es un registro publicado) y con el
registro de Novick (no promoverlo tal cual, o resolver antes el conflicto de esquema).
