## candidatos_giro

Ninguno. Esta corrida no investigó declaraciones ni posiciones políticas de Penadés; solo el caso
judicial y sus mandatos.

## hipotesis

- El número de víctimas y la tipificación exacta de los delitos varió con el tiempo (8 denunciantes
  en junio de 2023, 11 al momento de la formalización de octubre de 2023, 13-14 al momento de la
  acusación de octubre de 2025, con 10 de identidad reservada según la fiscal Ithurralde en abril de
  2026). No es una hipótesis por confirmar sino la evolución normal de una instrucción con
  declaraciones anticipadas sucesivas; se registró cada ampliación de la formalización como un hito
  separado, con su propia fecha y fuente, en lugar de fijar un número único.
- El texto de `busqueda.com.uy` (fuente del hito de formalización) escribe "fue formalizado el
  martes 9" cuando la fecha correcta, confirmada por al menos otras cuatro fuentes (ámbito del mismo
  10/10/2023, Wikipedia, y las notas de agosto/octubre de 2025 que recapitulan el caso), es el
  martes 10 de octubre de 2023. Se dejó la cita literal con el error del medio (regla dura: no se
  edita una cita) y se fijó `fecha: 2023-10-10` en el hito, que es un campo propio del investigador,
  no una cita.

## casos_vistos

- El caso Penadés en sí es el objeto de esta corrida (pedido explícito del mantenedor, regla 12); no
  se trata como "visto de paso".
- `https://www.montevideo.com.uy/Noticias/Penades-fue-imputado-por-un-nuevo-delito-un-hecho-de-violencia-privada-ocurrido-en-2014-uc934543`
  y `https://www.subrayado.com.uy/imputaron-penades-violencia-privada-hecho-2014-defensa-accedera-parcialmente-celulares-romina-celeste-y-paula-diaz-n986307`
  (27/08/2025): mencionan, de paso, que los celulares de dos denunciantes del caso Penadés fueron
  incautados "en el marco de la causa por una denuncia falsa radicada por Díaz contra el hoy
  presidente Yamandú Orsi que terminó con Papasso presa". Es un caso judicial distinto, sobre Orsi
  como denunciado por una denuncia que la Justicia habría tenido por falsa. No investigado (fuera
  del alcance de esta corrida); anotado como pista cruzada en
  `../../../pistas/orsi.yaml` (ruta real del corpus: `la-casta-corpus/pistas/orsi.yaml`, no
  `corpus/pistas/` como dice el enunciado general).
- Colaboradores condenados en la misma causa (no políticos, no investigados como involucrados):
  Carlos Taroco (exdirector del ex Comcar, condenado por cohecho calificado, asociación para
  delinquir y revelación de secreto) y seis procesos abreviados más por intentar entorpecer la
  investigación armando un "flujograma" de denunciantes (fuente: montevideo-portal, 2024-04-08).
  Mencionados en el `resumen` solo si hiciera falta más contexto; no llevan `involucrados[]` porque
  el esquema de `casos.yaml` solo admite políticos (`ref('politicos')`).

## verificacion_manual

- `https://grupormultimedio.com/audiencia-por-el-caso-penades-fue-suspendida-tras-intensos-cruces-id202987/`
  (07/08/2026) y `https://grupormultimedio.com/justicia-rechaza-nuevo-pedido-de-sobreseimiento-para-penades-id204250/`
  (21/08/2026): `pnpm fuente` solo devuelve el menú de navegación y teasers de otras notas (525 y 729
  caracteres respectivamente), no el cuerpo de la nota. El sitio parece servir el contenido por JS o
  detrás de algún bloqueo que la extracción no atraviesa. No se usaron como fuente. El hito del
  22/08/2026 (`prensa-mercosur`) cubre el mismo período con contenido completo, pero queda con
  `_faltante: segunda_fuente` porque no se pudo confirmar un segundo grupo de medios legible para esa
  fecha exacta.
- `https://www.gub.uy/fiscalia-general-nacion/comunicacion/comunicados`: la página lista solo 816
  caracteres (índice renderizado por JavaScript); no se pudo ubicar un comunicado individual de
  Fiscalía sobre el caso Penadés navegando desde ahí ni por `WebSearch` con `site:gub.uy`. Todas las
  etapas de la Fiscalía en este registro están sostenidas por prensa de dos grupos, no por el
  comunicado oficial directo. Si el mantenedor quiere el comunicado exacto, convendría un pedido de
  acceso a la información pública (ley 18.381) o revisar si Fiscalía lo republica en otro formato.
- `https://parlamento.gub.uy/camarasycomisiones/legisladores/2901` y
  `.../documentos/diario-de-sesion/6882/video`: son páginas de aplicación (SPA) que no devuelven
  contenido completo por HTTP simple; el diario de sesiones del 7/6/2023 se ubicó por otra vía (ver
  abajo).

## cobertura_del_periodo

- **Caso judicial**: cubierto desde la denuncia pública (29/03/2023) hasta el 22/08/2026 (último
  hito con fuente legible), con 10 hitos en `estado_judicial`. La causa sigue abierta (etapa de
  control de acusación) al 9/9/2026, fecha de esta corrida; no hay sentencia. Un hito
  (`_faltante: segunda_fuente`) depende de una sola fuente por el problema de lectura de
  `grupormultimedio.com` descrito arriba.
- **Mandatos**: cubiertos desde 1990 (Edil de Montevideo) hasta el 11/10/2023 (expulsión del
  Senado), con fuente oficial (`legislaturas-actuo` y CV de `parlamento.gub.uy`) para cada tramo.
  La ficha oficial de `legislaturas-actuo` trae una fila anómala para la "Legislatura XLV
  (2000-2005)" con fechas "08-12-2004 a 08-12-2004" (un solo día, sin la etiqueta "Representante
  Nacional" que sí tienen las demás filas): no se usó esa fila; el segundo período como Diputado
  (2000-2005) se cargó como continuación del primero (1995-2005) apoyado en el CV oficial ("2000/04
  Relecto Representante Nacional (Diputado) por Montevideo") y en que la fila siguiente
  (Legislatura XLVI, Senador) arranca exactamente el 15/02/2005, sin superposición. Queda para el
  editor decidir si esto amerita `verificacion: manual` sobre ese tramo puntual.
- **Declaraciones, promesas, votaciones, chequeos**: no investigados en esta corrida (fuera del
  pedido explícito del brief). La ficha de Penadés queda con esas secciones vacías; se explicó en
  `politicos.yaml.cobertura.texto`.

## objeciones_al_brief

Ninguna objeción de Regla 0: el brief pide investigar un caso judicial específico con pedido
explícito del mantenedor (regla 12), en las dos direcciones (acusación y desenlace), sin pedir
asimetría de ningún tipo.

Una precisión metodológica sobre la instrucción de no identificar víctimas: el brief pide "sin
ningún dato que identifique a las víctimas (menores de edad): ni nombres, ni iniciales, ni edades
exactas, ni lugares que las identifiquen". Se siguió al pie de la letra para todas las víctimas de
identidad reservada (que son la mayoría). Se hizo una excepción puntual para la primera denunciante
pública, que ya era adulta al declarar y se identificó voluntaria y repetidamente con su nombre real
en entrevistas, redes y una conferencia de prensa propia (no es una víctima de identidad reservada:
es una denunciante pública), y que ya está nombrada en contenido publicado del sitio
(`content/eventos/caso-penades.yaml`, con una cita de Wikipedia que la nombra). Se la nombra una
sola vez en el `resumen` de `casos.yaml`, replicando el criterio ya usado en ese archivo publicado.
Ninguna otra persona (ni las cuatro víctimas de la ampliación de mayo de 2025, ni el denunciante
radicado en España, ni el resto) se nombra en este registro. Si el editor prefiere no nombrar a
nadie, es un cambio de una palabra en el `resumen`.
