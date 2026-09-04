# Razones — corrida 2026-09-04-orsi-transparencia-corrupcion

Editor: Claude Sonnet 5 (`claude-sonnet-5`), corrida deliberada bajo el experimento de
`EXPERIMENTO.md` (editor con Sonnet en vez de Fable; el crítico de este lote también corrió con
Sonnet en vez de Opus, ver nota al inicio de `critica.md`). No repetí la corrida del crítico; sus
objeciones están casi todas bien fundadas y las trabajé como llegaron, marcando explícitamente los
dos o tres puntos donde decidí distinto de lo que sugería.

## Cambios de forma

- `declaraciones.yaml`: dos citas no verificaron contra su fuente en la etapa de verificación
  previa a esta revisión y volvieron al investigador. Una estaba acortada por el medio (le
  faltaba una cláusula); la otra unía dos oraciones no contiguas con "[...]". El investigador las
  corrigió a copia literal exacta antes de que yo recibiera el lote; no encontré, al releer las 35
  citas contra `critica.md`, ningún otro problema de fidelidad (el crítico confirma 35/35 exactas).
  No sé cuáles dos eran específicamente porque el paso ya estaba resuelto cuando empecé; lo dejo
  constando por instrucción del orquestador, no porque yo haya tocado nada ahí.

## Cambios sobre el crudo (no triviales)

1. **`declaraciones[0]` (26/5/2026, "Cuando usted vea la factura...")**: agregué `_faltante:
   segunda_fuente` y bajé `revision.tier` a `probable`, aunque las dos fuentes declaradas
   (montevideo-portal / grupo `montevideo-comm`; caras-y-caretas / grupo `editora-caras-y-caretas`)
   pasan la regla mecánica de grupos distintos. Motivo: objeción `corregir`/`un_solo_grupo` de
   `critica.md` — el crítico verificó que el párrafo alrededor de la cita es casi idéntico palabra
   por palabra en ambas notas, incluida la cifra de US$ 3.396.500 y la referencia a "Así nos va
   (Radio Carve)", el patrón de "una copia de agencia en varios diarios cuenta como uno" que
   CLAUDE.md pide tratar como una sola cobertura. Decidí la independencia real, no el chequeo
   mecánico de grupos, tal como me pidió el orquestador en el punto 4 de sus instrucciones. La
   cita en sí sigue siendo literal y exacta; no toqué el texto, solo el tier y el nivel de
   evidencia efectivo.

2. **`promesas.yaml`, las tres promesas (Jutep, donaciones anónimas, designaciones directas)**:
   agregué `_faltante: segunda_fuente` a `origen` en las tres y bajé `revision.tier` a `probable`
   en las tres. Motivo: objeción `corregir`/`un_solo_grupo` de `critica.md` en `promesas[0,1,2]` —
   mpp.org.uy (grupo `frente-amplio`) es el sitio de campaña del propio sector de Orsi y, según su
   propio registro ya commiteado en `content/medios/mpp.yaml`, "nunca cuenta como segunda fuente
   independiente"; subrayado es la única cobertura periodística genuina de las tres. La regla
   mecánica de dos grupos pasaba porque los slugs de grupo son distintos; la independencia real no.
   Mismo criterio que el punto 1: decidí por la independencia real. Es el tratamiento simétrico del
   caso ya resuelto para `lacallepou-uy` en la corrida de Lacalle Pou (mismo problema, mismo medio
   de campaña, mismo criterio).

3. **`promesas.yaml`: `evidencias_candidatas` pasó a `evidencias` en las tres promesas**, y agregué
   `estado` + `fundamentacion` en cada una:
   - **Promesa 0 (Fortalecer la Jutep)**: `en_proceso_adelantada`. Pesé la evidencia en contra (la
     propia Jutep reconoció en abril de 2026 que no tenía forma reglamentaria ni personal
     especializado para controlar declaraciones en papel, fuente única) contra la evidencia a
     favor (el artículo 566 de la Ley 20.446 y la Resolución 405/2025 de la Jutep, que desde el
     1/1/2026 exigen declaraciones exclusivamente electrónicas — nivel textual, documento oficial
     de la propia Jutep, y cronológicamente posterior al diagnóstico de abril, que describe una
     declaración presentada bajo el régimen anterior). Es una acción de gobierno concreta que
     cierra la falla específica señalada, sin evidencia de que se haya resuelto la carencia de
     personal. El detalle completo está en `fundamentacion`.
   - **Promesa 1 (Regular donaciones anónimas)**: `en_proceso_demorada`, con caveat explícito en la
     `fundamentacion` de que la clasificación es provisional. Motivo: objeción `corregir` de
     `critica.md` — esta promesa no tenía ninguna `evidencias_candidatas`, pese a que
     `consultas.jsonl` registra una búsqueda con resultados ("Orsi ley financiamiento partidos
     políticos donaciones anónimas 2025 2026 proyecto -> 8 resultados") que no llegó a producir una
     evidencia citable. No abrí esos 8 resultados: hacerlo es investigación (buscar URLs nuevas),
     no edición, y excede lo que corresponde a este rol (el editor lee lo ya reunido, no sale a
     buscar). Dejo esto explícito en `notas_internas` y en el informe final como pendiente para una
     corrida de investigación dedicada a financiamiento de partidos políticos.
   - **Promesa 2 (Limitar designaciones directas)**: `en_proceso_adelantada`. La Ley 20.451 (a
     favor, documento oficial + nota, bien corroborada) limita designaciones directas en
     intendencias a 4%; el dato de la ONSC más el caso de Soriano (efecto neutral, fuente única,
     con el descargo de la intendencia incluido) muestra una disputa de cumplimiento sin resolver.
     Noté que la ley cubre solo intendencias, no "el estado" en el sentido amplio de la promesa; lo
     dejé explícito en la `fundamentacion` en vez de tratar la ley como si cerrara la promesa
     entera.

4. **`giros.yaml` (nuevo, 1 registro)**: armé el único candidato a giro que señala `notas.md`
   (sección `candidatos_giro`): del comentario irónico de Orsi en Salto (30/5/2026, "me tiro de
   cabeza") al mensaje formal de disculpas desde Presidencia (2/6/2026). Elegí `declaracion_antes`
   = `orsi/2026-05-30-me-equivoco-todos-dias` (agregué `_slug: me-equivoco-todos-los-dias` a ese
   registro en `declaraciones.yaml`, que `slugificar()` recorta a `me-equivoco-todos-dias` por
   descartar palabras vacías) y `declaracion_despues` = `orsi/2026-06-02-pido-disculpas-mi-proceder`
   (agregué `_slug: pido-disculpas-mi-proceder`). Clasifiqué `cambio: cambio_parcial`, no
   `cambio_total`: en ambos momentos Orsi remite la determinación de si hubo falta a los organismos
   de contralor, sin admitir un error por sí mismo; lo que cambia es el registro (de respuesta
   improvisada e irónica a mensaje preparado con reconocimiento explícito del precio conveniente y
   disculpa condicional), no la posición de fondo. Clasifiqué `explicacion: justificado_por_contexto`
   porque encontré, y verifiqué con `pnpm fuente` en esta sesión (no estaba citado con esas palabras
   en ningún registro existente), que la misma nota de infobae ya usada en `declaraciones[9]`
   documenta que la respuesta de Salto "fue considerada una 'tomadura de pelo' por parte de
   dirigentes de la oposición" — el hecho externo que conecta los dos momentos. `notas.md` había
   dejado esto como "búsqueda web, no leído con pnpm fuente porque no se iba a citar"; lo leí yo
   mismo porque acá sí se cita, siguiendo la regla de que ninguna URL se cita sin abrirla en la
   sesión que la usa. El giro queda en tier `probable` porque tanto `declaracion_despues` como la
   `evidencia_explicacion` dependen de una sola fuente (infobae).

5. **`casos.yaml` (nuevo, 1 registro: Cardama/Lazo)**: de los dos casos que documenta `notas.md`,
   armé `casos.yaml` solo con el caso de la denuncia de la oposición contra la ministra Sandra
   Lazo. El caso de la camioneta/Jutep **no** entra a `casos.yaml`: siguiendo el punto 1 de las
   instrucciones del orquestador, el crítico tiene razón en su objeción `bloquea` — las denuncias
   ante la Jutep son anónimas (confirmado por la propia presidenta de la Jutep, Ana María
   Ferraris, "tres o cuatro" denuncias anónimas, y por el propio Orsi: "por lo general llegan
   denuncias anónimas") y el umbral del proyecto exige una persona identificable. El precedente ya
   publicado `content/casos/jutep-declaraciones-juradas-2026.yaml` (Lacalle Pou) tiene un
   denunciante identificado por nombre, partido y cargo (el convencional colorado Esequiel
   Ibarra): es la diferencia real entre los dos casos, no el partido del político investigado. Si
   se aplicara el mismo umbral sin la condición de identificabilidad, el caso de Lacalle Pou
   también debería caer, y no cae, porque sí cumple esa condición. Aplicar la regla y que el
   resultado no sea simétrico en apariencia (entra uno, no entra el otro) es la regla funcionando,
   no una asimetría editorial; lo dejo explícito acá y en
   `hipotesis/orsi/camioneta-jutep-denuncias-anonimas.yaml` para que un lector que lo lea al revés
   encuentre la fundamentación completa y verificable.
   Para el caso Cardama/Lazo sí hay personas identificables (los diputados Pablo Abdala, Gerardo
   Sotelo, Felipe Schipani y Gabriel Gianoli, todos nombrados con cargo en medios), así que cumple
   el umbral por la vía de "acusación pública hecha por persona identificable en un medio" — no
   necesariamente por "denuncia formal presentada": ninguna fuente de este lote confirma que la
   Fiscalía haya recibido la denuncia contra Lazo a la fecha de esta corrida (las citas de mayo y
   agosto de 2026 usan lenguaje de decisión e intención, "resolvieron presentar", "el texto está
   siendo redactado"). Verifiqué esto releyendo con `pnpm fuente` las dos notas centrales
   (el-observador 8/5/2026 y subrayado 24/8/2026) porque la crítica lo señalaba como algo a
   confirmar antes de promover. Quedó en tier `probable`, con la etapa `denuncia` usada en el
   sentido del acto público de denunciar (que el umbral sí reconoce como suficiente), no como
   afirmación de que el expediente ya está en Fiscalía — lo dejo explícito en `notas_internas` para
   que se corrija si una corrida futura confirma o desmiente el estado real del expediente.
   Sobre la instrucción 2 del orquestador (la frase nueva del brief, "un caso sin su desenlace
   documentado no se publica"): verifiqué que los tres casos ya promovidos (Astesiano, Marset,
   Jutep-Lacalle Pou) están en tier `probable`, ninguno en `publicado`; Astesiano tiene condena,
   Marset tiene un archivo parcial (con una parte de la causa todavía en investigación), y
   Jutep-Lacalle Pou no tiene ningún desenlace. La regla y el precedente no se contradicen: un caso
   sin desenlace puede existir en `probable`, no en `publicado`. Aplico el mismo criterio acá: el
   caso Cardama/Lazo queda en `probable` precisamente porque no tiene desenlace, del mismo modo
   que el precedente de Lacalle Pou/Jutep.
   No incluí en este caso la denuncia que el propio gobierno de Orsi presentó contra la empresa
   Cardama (octubre de 2025): es un asunto distinto (Orsi como querellante contra un privado por
   un contrato de la gestión anterior, no una acusación contra su gobierno), y lo dejo solo como
   contexto en el `resumen`. Sandra Lazo no tiene hoy registro en `content/politicos/` ni en
   `content/referentes/` (lo verifiqué buscando en ambas carpetas); no la incluí en `involucrados`
   porque crear ese registro es una adición de tipo "semilla", fuera del alcance de este editor en
   esta corrida. Queda como pendiente explícito en `notas_internas` del caso y en el informe final.

6. **Tres archivos de hipótesis nuevos en `hipotesis/orsi/`**:
   - `camioneta-jutep-denuncias-anonimas.yaml`: el Caso 1 completo (ver punto 5), con la
     discrepancia entre fuentes sobre qué vehículo se usó como parte de pago (Hyundai 2020 según
     caras-y-caretas/ámbito/infobae, Renault según el pedido de Schipani, o una camioneta donada
     por una automotora en campaña según subrayado 3/8/2026) como cabo suelto explícito, que
     `notas.md` no había señalado como discrepancia.
   - `designaciones-directas-canelones-2023.yaml` y `donaciones-anonimas-campana-2020.yaml`: los
     dos candidatos que `notas.md` deja en su sección `hipotesis` (designaciones directas de Orsi
     como intendente de Canelones en 2023, y donaciones anónimas en su campaña de 2020), ninguno
     verificado con `pnpm fuente` por el investigador (quedan antes del período del brief, y en el
     segundo caso la fuente es un sitio no reconocido). Los abrí como hipótesis en vez de dejarlos
     solo en `notas.md` porque son candidatos a antecedente relevante para evaluar las promesas de
     2024 sobre los mismos temas, y `notas.md` se descarta al cerrar la corrida. Dejé
     `evidencia_a_favor`/`evidencia_en_contra` vacíos en las dos: no tengo una cita verificada por
     mí en esta sesión para ninguna de las dos, y prefiero un archivo con huecos explícitos a
     inventar una cita que no leí.

7. **Desbalance de cobertura del lote (12 de 13 declaraciones sobre la camioneta, 1 sobre
   Cardama)**: siguiendo el punto 3 de las instrucciones del orquestador, no inventé declaraciones
   nuevas para equilibrar el lote. Dejé constancia en `notas_internas` de `declaraciones[12]`
   (la única sobre Cardama) y en el informe final, con las dos URLs que ya identificó el crítico y
   que el investigador leyó pero no convirtió en declaración: el video de Presidencia del
   23/10/2025 (https://www.youtube.com/watch?v=1Le_HmMv2OM) y la nota de ámbito del 27/12/2025
   (https://www.ambito.com/uruguay/yamandu-orsi-aseguro-que-el-gobierno-se-mantendra-firme-contra-cardama-pese-la-posible-denuncia-del-astillero-n6228534).
   Quedan como pendiente explícito para una corrida siguiente centrada en el caso Cardama, no como
   hipótesis (no hay una narrativa por confirmar: son declaraciones ya leídas y con cita disponible,
   solo que no producidas en este lote).

## Simetría

Antes de cerrar me pregunté si aplico a Orsi el mismo umbral que aplicaría a un político de otro
partido con la misma evidencia:

- El criterio de independencia real de fuentes (puntos 1 y 2 arriba) es el mismo que ya se aplicó
  a `lacallepou-uy` en la corrida de Lacalle Pou: un sitio partidario o una copia de agencia no
  cuenta como segunda fuente aunque el chequeo mecánico de grupos lo deje pasar. Lo apliqué a las
  dos promesas de Orsi de la misma manera, sin mirar si el resultado (bajar a `probable`) era
  favorable o desfavorable para su gestión.
- El caso de la camioneta (desfavorable para Orsi) y el caso Cardama/Lazo (también desfavorable,
  aunque la denuncia sea contra su ministra y no contra él) recibieron el mismo umbral estricto de
  "persona identificable": el primero no lo cumple y queda en hipótesis; el segundo sí lo cumple y
  queda en `casos.yaml` en `probable`. No até el resultado a si el caso perjudica u ayuda a Orsi,
  sino a si hay o no una persona identificable formulando la acusación — el mismo criterio,
  aplicado en sentido contrario al resultado que tendría "todo lo desfavorable entra, todo lo
  favorable no", que sería la asimetría real a evitar.
- Las 13 declaraciones del lote reciben el mismo criterio de sourcing que en las corridas de
  Lacalle Pou y en la corrida paralela de impuestos de Orsi: toda declaración `reportado` de
  fuente única va a `probable`, sea favorable (la reafirmación del compromiso de "hacerse cargo")
  o desfavorable (el "tiro de cabeza" inicial) para Orsi. De las 13, bajaron a `probable`
  exactamente las que tienen una sola fuente (3 de 13: `[0]` por el problema de independencia real,
  `[3]` y `[9]` por fuente única real), sin relación con si el contenido es favorable o
  desfavorable.
- No agregué declaraciones para "equilibrar" el lote hacia Cardama (punto 7 arriba): hacerlo sin
  que el investigador las haya producido con fuente propia habría sido peor que dejar el
  desbalance documentado. La objetividad se protege documentando el hueco, no llenándolo con
  contenido que no pasó por investigación.

## Objeciones de `critica.md` que quedan sin resolver

- **`declaraciones[4]-[8]` y `[9]`, video original de Presidencia (1-2/6/2026)**: no se localizó
  en gub.uy ni en el canal de YouTube de Presidencia en esta corrida. Quedan en `reportado` con dos
  grupos (publicado) o una fuente (probable), con la mejora posible anotada en `notas_internas`.
- **Promesa de donaciones anónimas, 8 resultados de búsqueda sin revisar** (punto 2 arriba): no
  los abrí porque hacerlo es investigación, no edición; queda como pendiente explícito.
- **Desbalance de cobertura hacia la camioneta** (punto 7 arriba): documentado, no corregido con
  contenido nuevo por el motivo ya explicado.
- **Composición de la Jutep (mayoría Ferraris/Asti) como contexto de `declaraciones[3]`**: lo dejé
  en `notas_internas` para uso editorial, no lo incorporé al registro porque es información sobre
  la Jutep, no sobre lo que dijo Orsi, y el crítico mismo lo marca como contexto, no como defecto.
- **Estado real del expediente de la denuncia contra Lazo después del 25/8/2026**: no verificable
  con las herramientas de este rol (no hago búsqueda web general fuera del contexto de un giro);
  queda como pendiente explícito en `notas_internas` del caso para la próxima revisión o para
  cuando el mantenedor apruebe el registro.
- **Registro de Sandra Lazo en `content/politicos/` o `content/referentes/`**: pendiente, fuera
  del alcance de este editor (adición de tipo semilla).
