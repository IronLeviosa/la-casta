# Notas — eventos y cobertura de vicepresidentes (rescate de las críticas 2000-2015 y 2015-2030)

Modelo: claude-sonnet-5.

Este lote no investiga declaraciones ni promesas: rescata los 12 registros de `cobertura` que los
dos críticos del lote de vicepresidentes escribieron dentro de sus `critica.md` (porque los
eventos que referenciaban todavía no existían) y crea las fichas de evento que les faltaban. Por
eso no hay `declaraciones.yaml`, `promesas.yaml` ni `menciones.yaml` en esta carpeta.

## Unificación de eventos propuestos

Los dos críticos propusieron 6 slugs `propuesto:` distintos para lo que a primera vista parecían
4 hechos (dos de ellos reutilizados dos veces cada uno). Al leer las fuentes de cerca, la
unificación no fue 1 a 1:

- `propuesto:crisis-politica-peru-2022` (crítico 1) → **`crisis-politica-peru-2022`**, sin cambios.
- `propuesto:incidente-diplomatico-hierro-lopez-2023` (crítico 1) → **`incidente-diplomatico-hierro-lopez-2023`**, sin cambios.
- `propuesto:fallecimiento-danilo-astori-2023` (crítico 1) → **`fallecimiento-danilo-astori-2023`**, sin cambios.
- `propuesto:salida-topolansky-senado-2022` (crítico 2) → **`salida-topolansky-senado-2022`**, sin cambios.
- `propuesto:transicion-embajadas-gobierno-orsi-2025` (crítico 1, usado para el registro de
  Nin Novoa Y el de Hierro López) se **partió en dos eventos**, no se mantuvo como uno solo:
  - **`designaciones-embajadores-orsi-2025`**: para Nin Novoa (embajador en Brasil, anunciado el
    28/2/2025) y para Argimón (embajadora ante la Unesco, anunciada el 30/5/2025 y con venia del
    Senado el 14/10/2025). Este slug se fusionó con el `propuesto:designaciones-embajadores-2025`
    del crítico 2 (los dos registros de Argimón), porque describen el mismo fenómeno: embajadores
    designados por el gobierno de Orsi en 2025. Esta fusión es la que el encargo pedía detectar.
  - **`intento-designacion-bustillo-embajador-peru-2025`**: para el registro de Hierro López
    (montevideo-portal, 17/1/2025). Lo separé porque, al abrir la nota completa (y una segunda
    nota del 22/1/2025 y otra del 24/1/2025 que no estaban en ninguna de las dos corridas
    originales), confirmé que esta designación fue una propuesta del gobierno **saliente** de
    Lacalle Pou, no del entrante de Orsi ("la decisión de nombrar al excanciller... fue tomada a
    menos de dos meses de que se acabe el gobierno"; "según supo El Observador por fuentes de la
    administración saliente, la intención de enviar a Bustillo a Lima formó parte de una
    conversación entre Lacalle Pou y Yamandú Orsi"). Además, la venia se retiró el 24/1/2025 por
    falta de votos, así que Bustillo no asumió en ese momento. Etiquetarlo como
    "gobierno de Orsi" habría sido un error de atribución, no una cuestión de criterio editorial,
    así que lo corregí con una ficha propia en vez de forzar la fusión que proponía el crítico 1.

## candidatos_giro

Ninguno. Este lote no trabaja con `declaraciones`, así que no hay pares antes/después que evaluar.

## hipotesis

- **Fecha real de salida de Hierro López como embajador en Perú.** El crítico 1 ya había marcado
  como error el `hasta: 2022-12-07` de la ficha publicada de Hierro López y sugirió buscar la
  fecha real de 2025. Al investigar el intento de designación de Bustillo (enero de 2025) también
  aparecieron dos notas que el crítico no había visto: swissinfo.ch
  (18/6/2025, "El Gobierno impone la orden El Sol del Perú... al embajador de Uruguay en Lima,
  Luis Hierro") y larazon.pe (5/7/2025, "Tras culminar su misión diplomática en el Perú, el
  embajador de Uruguay, Luis Hierro López..."). Esto sugiere que Hierro López siguió como
  embajador hasta mediados de 2025 (no hasta febrero, como estimó el crítico 1, y mucho menos
  hasta diciembre de 2022, como dice hoy la ficha publicada), bajo el gobierno de Orsi. No lo
  llevo a un registro porque no abrí ninguna de las dos notas con `pnpm fuente` en esta sesión
  (solo las vi en el listado de `corpus:buscar`) y porque corregir la ficha de Hierro López es
  tarea de una corrección en `content/correcciones/`, no de este lote. Al correr `pnpm validar`
  completo encontré que esto ya está resuelto: existe
  `content/correcciones/2026-09-05-hierro-lopez-fecha-embajada.yaml`, que corrige el `hasta` a
  2025-06-17 (día de una ceremonia de despedida en Perú) y baja el mandato a tier `probable` por
  no tener el decreto exacto de cese. Dejo la pista igual, sin cambios, para que quede el rastro
  de que dos líneas de trabajo distintas llegaron a la misma conclusión de forma independiente.
- **Posible error de Infobae sobre los mandatos de Vázquez.** La nota de Infobae sobre la renuncia
  de Topolansky (1/3/2022) dice "Topolansky, que fue vicepresidenta en el segundo mandato de
  Tabaré Vázquez (2005-2010 y 2015-2020)", pero 2005-2010 fue el *primer* mandato de Vázquez (con
  Nin Novoa de vicepresidente), no el segundo. Ya lo había visto el crítico 2 como pista sin
  fuente primaria que lo confirme como error del medio; lo repito acá porque la nota que la
  contiene es una de las que uso en `cobertura.yaml`. No corresponde `discrepancias.yaml` (hace
  falta un documento oficial o diario de sesiones que decida, no otro artículo de Wikipedia).

## casos_vistos

- Ninguno nuevo sobre los ocho vicepresidentes de esta corrida (los que ya constaban —Sendic,
  Astesiano tangencial en la pista de Bergara— vienen de las críticas anteriores, no de este
  lote).
- El caso del pasaporte de Sebastián Marset aparece de fondo en varias notas usadas acá
  (infobae sobre Argimón/Ache del 30/5/2025, montevideo-portal sobre Bustillo del 17 y 24/1/2025,
  el-observador del 22/1/2025) porque Francisco Bustillo —excanciller, no vicepresidente— está
  implicado. No lo investigo: no es sobre ninguno de los ocho vicepresidentes de este lote y el
  brief de esta corrida no lo pide. Anoté una pista para `bustillo` en
  `corpus/pistas/bustillo.yaml` con el resumen y las fuentes ya vistas, para cuando corresponda
  investigarlo si se agrega como político cubierto.

## verificacion_manual

Ninguna. Las 12 URLs de `cobertura.yaml` y las de `eventos.yaml` se leyeron con `pnpm fuente` en
esta sesión y devolvieron texto. La nota de la diaria (ladiaria.com.uy, Sendic) está detrás de
paywall pero el extracto que devuelve `pnpm fuente` (812 caracteres) alcanza a cubrir completa la
cita que necesitaba, así que no quedó pendiente nada de esa nota.

## cobertura_del_periodo

Períodos y contextos cubiertos por los 12 registros de `cobertura.yaml`:
- 2017 (gestión, Frente Amplio): renuncia de Sendic — 3 notas, las tres de tono neutral.
- 2022 (gestión/oposición según el caso): comentario de Hierro López (Colorado) sobre la crisis de
  Perú — neutral; renuncia de Topolansky (FA) a su banca de senadora — neutral.
- 2023 (oposición para Hierro López, fallecido para Astori): incidente diplomático de Hierro López
  por sus comentarios sobre Argentina — desfavorable; fallecimiento de Astori (FA) — favorable
  (nota necrológica, mismo criterio que se aplicaría a cualquier político de cualquier partido).
- 2025 (transición y gestión temprana de Orsi): intento fallido de designar a Bustillo en
  sustitución de Hierro López (Colorado) — neutral; designación de Nin Novoa (FA) como embajador
  en Brasil — favorable; designación de Argimón (Nacional) como embajadora ante la Unesco, en dos
  etapas — desfavorable las dos veces; instalación del nuevo Parlamento con la asunción de Cosse
  (FA) como vicepresidenta — neutral.

Lo que este lote NO cubre: cualquier vicepresidente anterior a 2000 (fuera del recorte de las dos
corridas de origen) y cualquier cobertura de estas ocho personas fuera de los hechos puntuales que
los críticos ya habían señalado al revisar las fichas de identidad. Este es un rescate de hallazgos
puntuales de una crítica, no un relevamiento sistemático de cobertura de prensa sobre cada
vicepresidente; el reparto de tono de la sección siguiente hay que leerlo con esa limitación en
mente.

## objeciones_al_brief

Ninguna que rechace instrucciones del encargo. Dos aclaraciones de método, no de sesgo:

1. La fusión/partición de eventos que hice (ver arriba) no siguió mecánicamente la propuesta de
   ningún crítico: fusioné dos slugs que apuntaban al mismo hecho (embajadores del gobierno de
   Orsi en 2025) pero separé un tercero que un crítico había etiquetado como parte de ese mismo
   hecho y que, al verificar la fuente completa, resultó ser una decisión del gobierno saliente de
   Lacalle Pou. La corrección va en la dirección de la precisión factual, no de favorecer o
   perjudicar a ningún partido: si hubiera encontrado el error en sentido contrario (atribuirle a
   Lacalle Pou algo de Orsi) lo habría corregido igual.
2. **Reparto de tono por partido — no lo maquillo.** De los 12 registros: Partido Colorado
   (Hierro López, 3 registros) quedó en 0 favorables / 2 neutrales / 1 desfavorable; Frente Amplio
   (Sendic, Topolansky, Astori, Nin Novoa, Cosse, 7 registros) quedó en 2 favorables / 5 neutrales
   / 0 desfavorables; Partido Nacional (Argimón, 2 registros) quedó en 0 favorables / 0 neutrales
   / 2 desfavorables. Es un reparto desparejo y no lo escondo. La razón, hasta donde puedo
   comprobar con lo que leí: no viene de elegir medios distintos para tratar a cada partido (para
   Hierro López y para Argimón usé exactamente los mismos medios —El Observador, Infobae— que para
   las figuras del Frente Amplio), sino de la naturaleza de cada hecho puntual que cada crítico ya
   había encontrado al revisar las fichas de identidad: una nota necrológica (favorable casi por
   definición, y con elogios de Nacional para Astori); un tuit de celebración de un correligionario
   por una designación (favorable); una interna partidaria hostil hacia dos designaciones cruzadas
   entre partidos —Argimón aceptando un cargo de un gobierno del Frente Amplio, y antes, Bustillo
   intentando ser designado por un gobierno que ya no iba a estar— que en los dos casos generó
   fricción dentro del propio partido de origen de la persona designada. No tengo, dentro de esta
   corrida, un caso simétrico de una figura del Frente Amplio aceptando un cargo de un gobierno de
   otro signo para comprobar si generaría la misma cobertura desfavorable; no lo afirmo ni lo
   descarto, solo señalo que esta muestra de 12 no alcanza para esa comparación. Quien edite esto
   debería tenerlo presente antes de sacar conclusiones sobre sesgo de prensa a partir de esta
   carpeta sola.
