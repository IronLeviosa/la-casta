# Notas — Semilla de candidatos presidenciales 2024

## Criterio de inclusión aplicado

Fuente para el corte: tabla oficial de resultados citada a "Corte Electoral" en
`https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2024` (primera vuelta,
27/10/2024) y su tabla de balotaje (24/11/2024).

Umbral: entra todo lema con al menos una banca en Diputados o en Senadores.

| Candidato | Lema | Votos 1ª vuelta | % | Senadores | Diputados | ¿Entra? |
|---|---|---|---|---|---|---|
| Yamandú Orsi | Frente Amplio | 1.071.826 | 43,86% | 16/30 | 48/99 | Ya tiene ficha (`orsi.yaml`); no se reescribe |
| Álvaro Delgado | Partido Nacional | 655.426 | 26,82% | 9/30 | 29/99 | Sí |
| Andrés Ojeda | Partido Colorado | 392.592 | 16,07% | 5/30 | 17/99 | Sí |
| Gustavo Salle | Identidad Soberana | 65.796 | 2,69% | 0/30 | 2/99 | Sí (por Diputados) |
| Guido Manini Ríos | Cabildo Abierto | 60.549 | 2,48% | 0/30 | 2/99 | Sí (por Diputados) |
| Pablo Mieres | Partido Independiente | 41.618 | 1,70% | 0/30 | 1/99 | Sí (por Diputados) |
| Eduardo Lust | Partido Constitucional Ambientalista | 11.865 | 0,49% | 0/30 | 0/99 | **No.** Ningún banca en ninguna cámara. |
| Gonzalo Martínez | Unidad Popular - Frente de Trabajadores (lema "Asamblea Popular") | 10.102 | 0,41% | 0/30 | 0/99 | **No.** Ninguna banca. |
| César Vega | Partido Ecologista Radical Intransigente (PERI) | 9.281 | 0,38% | 0/30 | 0/99 | **No.** Ninguna banca (en 2019 sí había obtenido una banca de diputado, pero en 2024 no). |
| Guillermo Franchi | Partido Por los Cambios Necesarios | 3.183 | 0,13% | 0/30 | 0/99 | **No.** Ninguna banca. |
| Martín Pérez Banchero | Partido Avanzar Republicano | 1.909 | 0,08% | 0/30 | 0/99 | **No.** Ninguna banca. |

Los seis candidatos que quedaron afuera del umbral (Lust, Martínez, Vega, Franchi, Pérez Banchero,
y — de hecho el propio corte deja ver que no hubo ningún caso límite reñido: la diferencia entre el
último que entra (Mieres, 41.618 votos, 1 diputado) y el primero que queda afuera (Lust, 11.865
votos, 0 bancas) es de casi 30.000 votos) no tienen ficha en este lote. Ninguno de los seis "pesó"
de forma documentable en el resultado nacional (ninguno pasó del 0,5% de los votos válidos ni tuvo
incidencia legislativa), así que no hay objeción de Regla 0 que hacer acá: el corte no dejó afuera a
nadie que el umbral debiera razonablemente incluir.

## Fuentes no-Wikipedia por persona (control de esfuerzo parejo)

- **Álvaro Delgado**: 7 fuentes no-Wikipedia (subrayado, teledoce, la-diaria, ambito x2,
  el-observador x2, más la biografía oficial en PDF del Parlamento). Es, con diferencia, el que
  más fuentes no-wiki tiene, pero no es porque haya más material disponible sobre él que sobre
  los demás: es porque la página de Wikipedia dedicada a él (`Álvaro_Delgado_Ceretta`) se descargó
  con un problema de codificación (ver `verificacion_manual` abajo) y tuve que reconstruir toda su
  cronología de cargos con fuentes de prensa y un documento oficial en su lugar. Si esa página se
  pudiera leer bien, el esfuerzo real hubiera sido comparable al de los demás.
- **Andrés Ojeda**: 1 fuente no-Wikipedia (Búsqueda, sobre la nueva composición del Senado).
- **Guido Manini Ríos**: 1 fuente no-Wikipedia (Ámbito, sobre un veto de 2024).
- **Pablo Mieres**: 2 fuentes no-Wikipedia (Resolución oficial de Presidencia + diario de sesiones
  del Parlamento). Es el único con una fuente `documento_oficial` y una `diario_de_sesiones`.
- **Gustavo Salle**: 1 fuente no-Wikipedia (El Observador, sobre el inicio de la 50ª legislatura).

Con la excepción de Delgado (por el problema técnico ya explicado), el esfuerzo de búsqueda fue el
mismo para los cinco: para cada uno se buscó primero en el corpus, después su ficha en
`parlamento.gub.uy`, y después una nota de prensa uruguaya que confirmara el mandato vigente o más
reciente. En los cuatro casos donde alcanzó con una sola fuente no-wiki fue porque la nota
encontrada ya confirmaba el dato sin ambigüedad, no porque se haya buscado menos.

## Precisión de fechas (año/mes en vez de día exacto)

Por el cambio de esquema a `FechaParcial`, estos cargos quedaron con precisión de año o de mes
porque la fuente disponible no daba el día exacto:

- **Delgado — Inspector General del Trabajo** (`2000`–`2004`, año): la única fuente encontrada
  (Subrayado) da los años de inicio y fin, no el día. La página de Parlamento (biografía en PDF)
  tampoco lo especifica para este cargo puntual.
- **Delgado — Representante Nacional** (`2005`–`2015`, año): Subrayado da los años de las dos
  reelecciones (2005 y 2010); la biografía oficial del Parlamento confirma los mismos períodos
  ("2005-2010", "2010-2015") pero tampoco da día. Es sabido que las legislaturas uruguayas asumen
  el 15 de febrero, pero preferí no afirmar ese día sin una fuente que lo dijera explícitamente
  para este caso puntual, así que quedó en precisión de año.
- **Delgado — Senador (primer período)**: `desde` quedó en año (`2015`) porque la fuente
  (Subrayado) solo confirma que fue "electo senador" en la elección de 2014, no la fecha exacta en
  que asumió la banca. `hasta` sí tiene precisión de día (`2020-03-01`): la nota de Teledoce,
  publicada el 15/02/2020, cita a Delgado diciendo "en 15 días voy a renunciar" para asumir como
  secretario de Presidencia; sumando esos 15 días a la fecha de publicación se llega al 1º de
  marzo de 2020, que es además la fecha en que asume todo gobierno entrante en Uruguay.
- **Delgado — Secretario de la Presidencia**: `desde` (`2020-03-01`) usa el mismo cálculo anterior
  (fecha de la nota de Teledoce + "15 días" citados). `hasta` (`2023-12-21`) tiene precisión de día
  exacta: la nota de Ámbito del 10/12/2023 cita a Delgado confirmando que renuncia "el próximo
  jueves 21" de diciembre.

El resto de los cargos de este lote (Ojeda, Manini Ríos, Mieres, Salle, y la segunda etapa de
Delgado como senador en 2025) tiene precisión de día porque las fuentes usadas (Wikipedia con
infobox de fechas exactas, o notas de prensa fechadas el mismo día del hecho) sí la dan.

## Sobre los votos declarados en `candidaturas`

Todos los `votos` de este lote salen de una única tabla en
`es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2024` que cita expresamente "Fuente:
Corte Electoral" (primera vuelta) y "Fuente: Corte Electoral (2.ª Vuelta)" (balotaje). No encontré
una página de la Corte Electoral con los votos por lema en texto plano y citable: la página oficial
`gub.uy/corte-electoral/.../resultados-elecciones-nacionales-del-2024` solo ofrece descargas en
`.xlsx` por circuito, sin totales por partido en el cuerpo de la página, y no hay un medio
`corte-electoral` dado de alta en `content/medios/`. Además, una búsqueda web independiente (no
citable como fuente del registro, solo para chequear) devolvió exactamente las mismas cifras
(1.071.826 para el FA, 655.426 para el PN, 60.549 para CA, 41.618 para el PI, 9.281 para el PERI,
10.102 para Asamblea Popular) atribuidas a la Corte Electoral, lo que cruza el dato con el
organismo aunque no de forma directamente citable. Dejo dicho esto para que quede claro que "votos"
no es un número de prensa sin cruzar: es la misma tabla, atribuida al organismo, para los cinco.

Propongo agregar el medio `corte-electoral` (tipo `estatal`, grupo `estado-uruguayo`) a
`content/medios/` para poder citar directamente `eleccionesnacionales2024.corteelectoral.gub.uy` u
otra página oficial equivalente en el futuro.

## Cambio de esquema atendido: `candidaturas`

Se agregó `candidaturas` a los cinco registros de este lote, con `resultado: no_electo` en todos
los casos (ninguno de los cinco ganó la presidencia). Los `votos` y el `detalle` de cada uno están
arriba.

**Sobre Orsi**: el encargo pide agregar la entrada de `candidaturas` "a cada persona del lote,
incluida la que ya tengas escrita". No escribí una ficha nueva para Orsi (el encargo original decía
explícitamente "NO lo vuelvas a escribir" y "anotalos en notas.md, no los toques"), así que no
edité `content/politicos/orsi.yaml` directamente: ningún agente escribe en `content/` fuera de
`pnpm promover`, y cambiar un registro ya publicado requiere pasar por
`content/correcciones/` con `pnpm promover --correccion`. Dejo acá la entrada que debería
agregársele, para que el editor la aplique por ese camino:

```yaml
candidaturas:
  - cargo: Presidencia de la República
    fecha: 2024-11-24
    lema: Frente Amplio
    resultado: electo
    detalle: >-
      Ganó el balotaje del 24 de noviembre de 2024 con 51,13% de los votos válidos frente a
      Álvaro Delgado (Partido Nacional). Su lema obtuvo 16 bancas en el Senado y 48 en Diputados
      en primera vuelta.
    votos: 1212833
    fuentes:
      - url: https://es.wikipedia.org/wiki/Elecciones_generales_de_Uruguay_de_2024
        medio: wikipedia
        fecha: 2026-09-05
        tipo: nota
        titulo: Elecciones generales de Uruguay de 2024
        cita: "Frente AmplioYamandú Orsi - Carolina Cosse1.212.83351,13%49,77 %Fórmula ganadora"
        retrieved_at: 2026-09-05
```

## candidatos_giro

No aplica: este lote es solo de fichas de identidad (mandatos, candidaturas), no de
declaraciones. No se buscaron declaraciones ni se pueden armar giros con este material.

## hipotesis

- Ninguna hipótesis sin probar quedó pendiente entre los datos que sí se incluyeron: todo lo que
  no pude sostener con una cita literal quedó fuera del archivo principal (ver
  `verificacion_manual` y los puntos de precisión de fecha arriba).

## casos_vistos

Ninguno investigado (no correspondía por el encargo). Lo que apareció de pasada, mencionado en
notas de prensa o en las biografías de Wikipedia leídas para este lote, con la misma vara para
todos los partidos:

- Denuncia de Gustavo Salle contra el entonces vicepresidente Raúl Sendic por "usurpación de
  título" (mencionada en la ficha de Wikipedia de Salle, sin fecha exacta citada en el fragmento
  leído). Sendic no es parte de este lote.
- Denuncia penal de Gustavo Salle contra la entonces vicepresidenta Beatriz Argimón por la
  filtración de un audio; según la misma fuente (Wikipedia, ficha de Salle), "la Justicia
  desestimó el caso".
- Denuncias de Álvaro Delgado, como senador, sobre irregularidades en ANCAP (2005-2015), que
  derivaron en una comisión investigadora parlamentaria y en el procesamiento judicial del
  exvicepresidente Raúl Sendic por peculado y abuso de funciones (mencionado en la nota de
  El Observador `alvaro-delgado-el-gestor-activos...`). Sendic no es parte de este lote.
- Mención de pasada a Álvaro Delgado como secretario de Presidencia en el contexto del caso
  Astesiano (nota de El Observador vista en el corpus, `dcecc1439b`, sobre si a Lacalle Pou "le
  ocultaron los antecedentes de Astesiano"); no dice que Delgado tuviera responsabilidad, solo lo
  ubica en el cargo. No investigado.
- Mención de pasada a Álvaro Delgado en una nota de Infobae de 2026 sobre una polémica de Yamandú
  Orsi con un impuesto no declarado (`ff7a05ab42`, ya en el corpus); Delgado aparece solo
  opinando como dirigente opositor, no como sujeto de la denuncia. No investigado.

## verificacion_manual

- `https://es.wikipedia.org/wiki/Álvaro_Delgado_Ceretta`: **no se pudo citar.** El texto que
  devuelve `pnpm fuente` (probado dos veces, con `--forzar`, y también con la URL vía
  `es.m.wikipedia.org`) tiene un problema de codificación: todas las vocales acentuadas y la "ñ"
  llegan como secuencias corruptas (mojibake: "Ã¡lvaro", "polÃ­tico", etc.), es decir, texto real
  pero con bytes UTF-8 reinterpretados como Latin-1. Confirmé el problema leyendo el JSON crudo del
  corpus directamente (`la-casta-corpus/notas/0e63aceb97...json`): el campo `texto` ya está
  corrupto ahí, no es un artefacto de mi lectura. La misma nota de Wikipedia sobre "Elecciones
  generales de Uruguay de 2024" se descargó sin ningún problema de codificación, así que no es un
  bug general del script sino algo puntual de esa descarga (posiblemente un encabezado de
  compresión mal interpretado en ese momento). No usé ninguna cita de esa página; reconstruí toda
  la cronología de Delgado con prensa uruguaya y un documento oficial del Parlamento en su lugar
  (ver arriba). Recomiendo reintentar la descarga de esa URL más adelante (con `--forzar`) para
  confirmar si el problema era transitorio.

## cobertura_del_periodo

Este lote cubre solo identidad y trayectoria de cargos (mandatos + candidaturas), no
declaraciones ni gestión. Con eso en mente:

- **Delgado**: cargos desde 2000 (Inspector General del Trabajo) hasta la actualidad (renunció a
  su última banca en agosto de 2025 para presidir el Partido Nacional). Cubre función pública,
  legislativa y de gobierno (Poder Ejecutivo como secretario de Presidencia).
- **Ojeda**: cargos desde 2010 (edil) hasta la actualidad (senador en ejercicio). No tuvo cargo de
  gobierno antes de 2025; su trayectoria previa a la edilía fue solo partidaria/gremial, no cargo
  público.
- **Manini Ríos**: cargos desde 2015 (comandante en jefe del Ejército, no electivo) hasta 2025
  (fin de su banca de senador, no reelegido). No tiene cargo en la actualidad.
- **Mieres**: cargos desde 2000 (diputado) hasta 2024 (renuncia como ministro para hacer campaña).
  No tiene cargo en la actualidad; su trayectoria de casi 25 años en cargos públicos es la más
  larga de los cinco.
- **Salle**: un solo cargo documentado, diputado desde febrero de 2025 (su primer cargo público
  electivo). Su trayectoria previa fue como abogado litigante y activista, no como funcionario.

No hay asimetría de cobertura entre partidos: a los cinco se les buscó la misma clase de dato
(mandatos + candidatura 2024) con el mismo criterio de fuentes.

## objeciones_al_brief

Ninguna. El criterio de inclusión pedido por el brief (umbral parejo de representación
parlamentaria, aplicado igual a los seis lemas que no entraron y a los cinco que sí) ya es
simétrico y no tuve que corregir nada por Regla 0. El cambio de esquema sobre `candidaturas` y
sobre `FechaParcial`, comunicado a mitad de la corrida, tampoco introdujo ninguna asimetría: se
aplicó por igual a los cinco registros.

## referentes_faltantes

Ninguno: este lote no incluye `menciones`, así que no hubo necesidad de proponer referentes.
