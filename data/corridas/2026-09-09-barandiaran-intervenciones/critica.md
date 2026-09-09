# Crítica — corrida 2026-09-09-barandiaran-intervenciones

Modelo: Opus 5 (1M context) — `claude-opus-5[1m]`. Es el único rol que corre en Opus, por la regla
de modelos del mantenedor del 2026-09-07 (CLAUDE.md, «Reglas para agentes», punto 14). Los dos
tranches del lote declaran `claude-sonnet-5` en `_investigacion.modelo`, que es lo que corresponde.

Lote: `inbox/barandiaran/intervenciones/2026-09-09/`
Registros revisados: 99 declaraciones + 22 chequeos = 121.

## Cómo se revisó

No muestreé: verifiqué **las 99 citas, una por una**, contra los turnos extraídos en
`.cache/barandiaran-turnos/`, con la misma normalización que usa el validador
(`scripts/lib/texto.ts`: minúsculas, sin diacríticos, comillas y guiones unificados, espacios
colapsados, palabras cortadas por el PDF reunidas). Resultado: **98 exactas, 1 aproximada**
(`declaraciones[11]`, similitud 0,997).

Sobre esa base corrí tres controles más:

1. **Atribución**: para cada cita, el último marcador de orador (`SEÑOR X.-`, con sus variantes de
   OCR `SE~OR`, `SEfiiOR`, `SEROR`, `SEI'=JOR`, `SEF:IOR`) anterior a la cita, y si entre ese
   marcador y la cita hay un encabezado `## Turno N` (que el extractor ancla en el marcador de
   Barandiarán). Quince citas caen después del marcador de otro Diputado; en doce de ellas hay un
   `## Turno` en el medio, así que la cita está dentro de un bloque anclado en Barandiarán. Las
   tres restantes (`[52]`, `[53]`, `[65]`) las leí a mano: en las tres el orador es Barandiarán
   (interrumpe a Chifflet; interrumpe a Fernández Chaves —«tengo una duda que me gustaría plantear
   al señor Diputado Fernández Chaves»—; y funda su voto inmediatamente después de Balbi en una
   votación nominal, con «En nombre del Nuevo Espacio»). Un barrido laxo adicional buscando
   marcadores mal OCReados dentro del turno devolvió tres casos (`[9]`, `[15]`, `[45]`); los tres se
   verificaron a mano y ninguno es de otro orador.
2. **Resumen contra cita**: números y nombres propios que aparecen en el `resumen` y no en la
   `cita`, y después lectura del párrafo en el diario. De ahí salen casi todas las objeciones de
   contenido de esta crítica.
3. **Lectura completa del contexto** (entre 350 y 2.500 caracteres antes y después) de 51
   registros: los 5 años, los 16 temas, y todos los que resumen una posición fuerte a favor o en
   contra de un gobierno, de un monopolio o de una persona nombrada.

También verifiqué el aviso de la tranche A sobre el desborde de los bloques extraídos: en
`1995-03-08-0003.md` el turno 1 es efectivamente «Por el señor Diputado Bayardi.» y lo que sigue es
la votación nominal de otros Diputados. El descarte fue correcto. (El encargo que recibí menciona
ese caso como «una cita que era de Mahía»; el caso documentado y verificado es el del Diputado
Chapper en ese mismo diario, no Mahía.)

`pnpm validar --inbox inbox/barandiaran/intervenciones/2026-09-09`: 0 errores de esquema,
0 de referencias, 0 de simetría, 59 avisos (ninguno del lote: son de `content/empresas/*` y de la
cobertura por tema, ver «Objeciones al lote»). Las 22 referencias `chequeos[].declaracion` resuelven
todas contra los ids que `derivarId` va a construir; lo verifiqué reimplementando `slugificar` con
la lista real de `PALABRAS_VACIAS` de `scripts/lib/contenido.ts`.

---

## Objeciones por registro

### declaraciones[15] — 1996-08-13 — «Además, si algo quedó claro es que aquí hubo un crédito de US$ 137:000.000…»
- severidad: **bloquea**
- tipo: riesgo_legal
- objecion: El `resumen` afirma, en la voz del sitio y en indicativo, que hubo «intermediarios que
  cobraron comisiones millonarias, entre ellos un 4% de comisión (unos US$5.000.000) para el señor
  Estellano». Estellano es una persona privada identificable; el sitio no lo está citando, lo está
  afirmando. Y lo afirma sobre una investigación cuyo desenlace el propio lote declara no haber
  buscado (`notas.md > casos_vistos`: «No se investigó el desenlace»), sin etapa ni fecha de ningún
  acto judicial. Es el supuesto del art. 18 de la ley 18.331 y del art. 336 CP: se reproduce una
  imputación sin resolución sobre una persona nombrada. La cita, en cambio, no lo nombra: menciona
  a EDUCTRADE y a FOCOEX, que son empresas, y al crédito. Además el propio orador relativiza en el
  mismo turno: «¿Cómo hizo el señor Estellano —no tengo la menor idea— para evadir —si lo hizo— los
  impuestos…?» y «Lamento haber tenido que hacer esta intervención tan larga […] nombrar personas
  que no habría querido mencionar». Nada de eso está en el registro.
- cita_de_contexto: «el senor Estellano, que cobra el 4% de comisión, es decir, US$ 5:000.000 -¡US$
  5:000.0001-, también es intermediario.» / «¿Cómo hizo el senor Estellano -no tengo la menor idea-
  para evadir -si lo hizo- los impuestos que deberra haber pagado por US$ 5:000.000?» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-08-13%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0033).pdf
- accion_sugerida: Reescribir el `resumen` en voz atribuida y sin el nombre del particular: «Como
  miembro informante **en minoría** de la Comisión Investigadora […] sostuvo que el crédito de
  US$137.000.000 se ejecutó sin control del Tribunal de Cuentas y que en la operación intervinieron
  intermediarios privados que cobraron comisiones». El nombre puede quedar dentro de la cita si el
  editor la extiende al párrafo donde Barandiarán lo dice —ahí es texto del diario, con el matiz de
  duda incluido—, pero no en la voz del sitio. Lo mismo vale para `chequeos[8]`, cuya `afirmacion`
  hoy es «Un intermediario, el señor Estellano, cobró una comisión del 4%…»: la afirmación
  chequeable es la de Barandiarán, no un hecho del sitio, y hay que redactarla así.

### declaraciones[57] — 1995-07-25 — «Por lo tanto, se presenta a la Cámara de Repre- sentantes el siguiente proyecto de resolución…»
- severidad: **bloquea**
- tipo: riesgo_legal
- objecion: Tres cosas juntas. (a) El `resumen` dice «Como miembro informante de la Comisión
  Investigadora» y omite **«en minoría»**, que es como el propio lote lo describe en
  `notas.md > proyectos_presentados`. Sin ese calificativo el lector entiende que la conclusión es
  de la Comisión, no de una minoría de ella. (b) Nombra al «contador Enrique Braga» como sujeto de
  «presuntas irregularidades» y de una denuncia penal, sin etapa, sin fecha y sin desenlace: el
  mismo `notas.md` dice «No investigado más allá de su intervención». (c) La `cita` no son palabras
  de Barandiarán sino el texto del proyecto de resolución que él lee; empieza en «Por lo tanto, se
  presenta a la Cámara…» y sigue entre comillas. Publicada como «cita» en la ficha de una persona
  se lee como si él lo estuviera diciendo con esas palabras, que es casi lo mismo pero no lo mismo.
- cita_de_contexto: «surge la Comision de presuntas irregularidades en la actua- ción que le
  correspondiera al Directorio del Banco Central del Uruguay en dicha operación de venta, y en
  especial, en la actuación del contador Enrique Braga» / «2.- De acuerdo a lo anteriormente
  expuesto, esta Camara radicará la denuncia correspondiente en la Justicia Penal» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1995-07-25%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0034).pdf
- accion_sugerida: Agregar «en minoría» al `resumen` y atribuir («el proyecto de resolución que
  presentó concluía…»). Buscar y registrar qué resolvió la Cámara ese día con el proyecto en
  minoría —está en el mismo diario, en la votación— y si la denuncia llegó a radicarse. Sin ese
  desenlace el registro no puede ir a `publicado`: la regla de desenlaces de `content/casos/` no se
  esquiva poniendo la acusación dentro de una declaración. Si no aparece, el registro va a
  `probable` con el faltante explícito.

### declaraciones[68] — 1996-11-05 — «El doctor Solari tomó una mala decisión con respecto al doctor lasalvia…»
- severidad: **bloquea**
- tipo: riesgo_legal
- objecion: La cita y el resumen ponen en la página, sin etapa, sin fecha y sin desenlace: (a) una
  «denuncia penal todavía no resuelta por graves irregularidades» contra el doctor Lasalvia, y (b)
  el nombre completo de una particular fallecida, **Sandra Bresque**, con la causa de su muerte
  («muere […] como consecuencia de un parto que se supone debería haber sido normal»). Lo segundo
  es un dato de salud de persona identificada, del núcleo duro del art. 18 de la ley 18.331, y la
  persona no es figura pública: es una paciente. El resumen del sitio la nombra. Que Barandiarán lo
  haya dicho en Sala hace que la cita sea verificable; no convierte al sitio en el vocero.
- cita_de_contexto: «reincorporar a una persona que tiene una denuncia penal todavía no resuelta
  por graves irregularidades en su gestión» / «Me refiero a la senora Sandra Bresque, una joven
  madre que, teniendo su quinto hijo, muere con posterioridad» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-11-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0058).pdf
- accion_sugerida: Recortar la cita al tramo político —el cuestionamiento al respaldo político del
  Ministro, contiguo y justo antes: «¿tiene hoy por hoy el doctor Solari el respaldo político
  necesario para continuar?»— y reescribir el resumen sin el nombre de la fallecida («la muerte de
  una paciente tras un parto en un hospital público») y sin afirmar la denuncia como hecho («dijo
  que se había reincorporado a un funcionario con una denuncia penal pendiente»). Si el editor
  quiere conservar el caso Lasalvia, va a `content/casos/` con etapa, fecha y desenlace, no dentro
  de una declaración. El nombre de la paciente no se publica en ningún caso.

### declaraciones[11] — 1996-05-08 — «Sesenta y cuatro años después de la aprobación de esa ley…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: Única cita del lote que no es literal. El diario dice «fuera de lo que es el monopolio
  **y,** mirado desde el punto de vista»; la cita dice «fuera de lo que es el monopolio**,** y
  mirado desde el punto de vista». La coma se corrió un carácter. No cambia el sentido, pero
  `scripts/validadores/citas.ts` la va a devolver como `aproximada` (similitud 0,997) y, en un
  registro `publicado` con fuente `diario_de_sesiones`, «aproximada» es **error**, no aviso (línea
  228: «Un documento oficial o un diario de sesiones es texto fijo»). Con `revision.tier: publicado`
  este registro rompe el build.
- cita_de_contexto: «podríamos estar de acuerdo en que el 76% del alcohol vendido para el consumo
  humano estaría fuera de lo que es el monopolio y, mirado desde el punto de vista de la cantidad
  de alcohol» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-05-08%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0010).pdf
- accion_sugerida: Mover la coma en `cita` y en `evidencia.fuentes[0].cita`. Un carácter.

### declaraciones[42] — 1998-10-14 — «Hay una frase del Vicepresidente de los Estados Unidos, Al Gore…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita no sostiene el resumen; sostiene lo contrario. El `resumen` dice que
  «cuestionó que se tratara el agua como una mercancía» y «advirtió sobre el riesgo de que un
  operador privado o el propio Estado ganaran más cuanta más agua vendieran». La `cita` elegida es
  el pasaje donde argumenta **a favor** de que un privado haga lo que el Estado no prioriza («el
  gobierno debe tener el timón y no los remos»), e inmediatamente antes está «El Nuevo Espacio […]
  no tienen ningún inconveniente a priori con relación al tema de las concesiones». El lector va a
  leer un titular estatista con una cita privatizadora debajo. El pasaje que sí dice lo que el
  resumen dice está unos 700 caracteres más adelante, contiguo y citable.
- cita_de_contexto: «Si el negocio es vender agua, al privatizar este servicio, el sector privado
  que lo explote o el gobierno que entienda que el agua es una mercancía va a recibir más ingresos
  cuanto más cantidad de agua venda, mientras las organizaciones ambientalistas […] recalcan la
  necesidad de proteger este escaso recurso.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1998-10-14%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0058).pdf
- accion_sugerida: Cambiar la `cita` por ese tramo (y la de la fuente). Y agregar al resumen la
  salvedad que hoy falta —que dijo no tener inconveniente a priori con las concesiones—, porque sin
  eso el registro lo pinta más estatista de lo que fue. Alternativa igual de válida: dos
  declaraciones del mismo turno, una por cada posición, que es lo que el brief habilita.

### declaraciones[96] — 1999-05-05 — «Sinceramente, me preocupa mucho que la mayoría de los apartamentos de Punta del Este…»
- severidad: corregir
- tipo: riesgo_legal
- objecion: Dos problemas. (a) El `resumen` afirma en voz del sitio que «el anonimato de esas
  sociedades **ya facilita el lavado de dinero** en la propiedad urbana». La cita dice algo mucho
  más débil: «cuando alguien nos dice que allí se lava dinero, es difícil decir que no». Afirmar
  que el lavado ocurre, sobre un mercado inmobiliario concreto, es más de lo que la fuente
  respalda. (b) La cita, de 1.218 caracteres, termina nombrando un estudio jurídico existente —«las
  hubiese comprado en el **Estudio L1bermann** por US$ 1.250»— dentro de un párrafo sobre sociedades
  pantalla y, dos oraciones antes, sobre lavado. Es un particular identificable al que el sitio no
  le está imputando nada, pero que queda impreso en esa vecindad.
- cita_de_contexto: «cuando alguien nos dice que allí se lava dinero, es difícil decir que no» /
  «Si Bill Gates estuviera en Uruguay habría abierto dos sociedades anónimas […] y las hubiese
  comprado en el Estudio L1bermann por US$ 1.250 o un poco más.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1999-05-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0017).pdf
- accion_sugerida: Cortar la cita en «…Podemos plantear que se invierta la carga de la prueba y que
  nos digan si efectivamente ello ocurre. Sin embargo, no contamos con elementos. ¿Debemos permitir
  que ocurra lo mismo con la tierra?». El corte es contiguo, saca el nombre del estudio, baja la
  cita a ~700 caracteres y deja intacta la posición. Y reescribir el resumen: «sostuvo que el
  anonimato de las sociedades por acciones al portador impide saber quiénes son los dueños de la
  propiedad urbana y que por eso no se puede descartar el lavado».

### declaraciones[25] — 1997-09-03 — «En él se realizan algunos comentarios de neto corte racista sobre los latinoamericanos…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita arranca con un pronombre sin antecedente («En él…»): aislada en la página, el
  lector no sabe de qué habla. Y lo que afirma —que el manual de una aerolínea nombrada tiene
  comentarios racistas— aparece sin la atribución que sí está en el diario y en el resumen (una
  nota de la revista Posdata). El punto 6 de la lista de control y el riesgo de imputarle una
  práctica racista a una empresa nombrada apuntan al mismo arreglo.
- cita_de_contexto: «me voy a referir a una noticia publicada en el último número de la revista
  "Posdata", que hace referencia a un manual de entrenamiento y procedimiento que es entregado por
  la empresa American Airlines a sus pilotos. En él se realizan algunos comentarios…» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-09-03%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0062).pdf
- accion_sugerida: Extender la cita hacia atrás hasta «me voy a referir a una noticia publicada…».
  Es contiguo, y deja la atribución dentro de la cita.

### declaraciones[26] — 1997-09-03 — «un sistema por el que determinado bien o servicio es vendido sin requerir el consentimien- to previo…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: El inverso del anterior. El `resumen` nombra a Diners como la empresa que practica la
  «venta compulsiva»; la `cita` es una definición genérica que no nombra a nadie. El sitio pone el
  nombre y la fuente citada no lo respalda —aunque el diario sí, dos oraciones antes—.
- cita_de_contexto: «Otro tema al que me quiero referir es al de la tarjeta Diners, que en su
  operativa procede a la venta compulsiva o "a prepo". Se trata de […] un sistema por el que
  determinado bien o servicio es vendido sin requerir el consentimien- to previo del consumidor.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-09-03%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0062).pdf
- accion_sugerida: Extender la cita hacia atrás para que incluya el nombre. Contiguo.

### declaraciones[3] — 1995-08-23 — «El sistema de Seguridad Social está en crisis…»
- severidad: corregir
- tipo: cita_fuera_de_contexto
- objecion: La cita no es de Barandiarán: es el texto del documento «Aportes para la reforma de la
  seguridad social» del Nuevo Espacio, que él lee en Sala. El `resumen` lo dice («leyó el documento
  de su partido»), pero la página muestra la cita destacada y con `cargo_en_ese_momento`, así que
  se lee como palabras suyas. El brief además excluye expresamente «la lectura de un texto ajeno»;
  acá es un texto propio de su partido, lo que lo salva, pero la marca tiene que estar dentro de la
  cita, no solo en el resumen. Esto arrastra a `chequeos[3]`, cuya `afirmacion` («Los gastos de la
  Seguridad Social se acercaban al 16% del PBI en 1994») queda atribuida a él cuando la dijo el
  documento que leyó —el propio `dato_real` lo aclara, pero la `afirmacion` no—.
- cita_de_contexto: «Mientras tanto el Nuevo Espacio […] presenta un documento al que denomina
  "Aportes para la reforma de la seguridad social", fechado el 20 de marzo de 1995 […]. En la parte
  general sef'lala: "El sistema de Seguridad Social está en crisis…» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1995-08-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0042).pdf
- accion_sugerida: Extender la cita hacia atrás hasta «Mientras tanto el Nuevo Espacio…» (contiguo)
  o, si se prefiere corta, arrancar en «En la parte general sef'lala:». Y en `chequeos[3].afirmacion`
  decir de quién es la cifra.

### declaraciones[5] — 1995-08-23 — «En la medida en que la aplicación de esta reforma va a redundar en una mejor recaudación…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: El `resumen` dice que «explicó que el compromiso del Poder Ejecutivo era ajustar los
  montos de $1.050 y $1.250 […] con un cargo a Rentas Generales de unos US$20.000.000». La cita
  dice que **otro** lo dijo: «el sef'lor Diputado preopinante mencionaba el compromiso del Poder
  Ejecutivo en cuanto a que…». Barandiarán está recogiendo lo que dijo un colega y diciendo que
  espera la iniciativa. `chequeos[4]` hereda el problema: su `afirmacion` presenta como dicho por
  él un dato que él atribuye a un tercero, que a su vez lo atribuye al Poder Ejecutivo.
- cita_de_contexto: «Por otra parte, el sef'lor Diputado preopinante mencionaba el compromiso del
  Poder Ejecutivo en cuanto a que en la primera etapa se iban a modificar los montos…» / «En ese
  sentido, estamos esperando la iniciativa del Poder Ejecutivo.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1995-08-23%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0042).pdf
- accion_sugerida: Reescribir resumen y `afirmacion` con la cadena de atribución completa («recogió
  lo señalado por un Diputado preopinante sobre un compromiso del Poder Ejecutivo…»), o bajar el
  chequeo a dato de contexto y no chequearlo como afirmación suya.

### declaraciones[77] — 1997-11-25 — «Dentro de lo que pueden denominarse jubilaciones de privilegio…»
- severidad: corregir
- tipo: riesgo_legal
- objecion: La segunda oración del `resumen` dice, en presente y en voz del sitio, «las Cajas
  Militar y Policial, **cuyo déficit en su conjunto alcanza a US$ 250:000.000 anuales**». Es una
  cifra que el propio lote no pudo verificar (`notas.md > hipotesis` y `chequeos[19]`: «No se
  encontró […] un informe oficial»). El sitio no puede afirmar en indicativo un dato que su propio
  Veracímetro deja sin confirmar. Aparte, la cifra no está en la cita.
- cita_de_contexto: «cuyo déficit en su conjunto alcanza a US$ 250:000.000 anuales» (palabras de
  Barandiarán en el mismo turno) —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-11-25%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0085).pdf
- accion_sugerida: «…y recordó que las Cajas Militar y Policial, cuyo déficit conjunto estimó en
  US$250.000.000 anuales, quedaron excluidas de esa reforma».

### declaraciones[20] y declaraciones[69] — ANTEL 1995, US$500M / US$100M
- severidad: corregir
- tipo: contexto_omitido
- objecion: Dos registros de dos tranches distintas sobre la misma cifra, en dos instancias del
  mismo trámite legislativo (discusión general el 1996-12-11, fundamento de voto el 1997-02-03),
  con dos atribuciones distintas: `[69]` dice «De acuerdo con pala- bras de su propio Vicepresidente,
  el senor Tabaré Viera»; `[20]` dice «De acuerdo con los datos que nos entregara la propia empresa».
  El `resumen` de `[20]` borra esa atribución y presenta la cifra como afirmación lisa suya. Y hay
  dos chequeos (`[9]` y `[17]`) sobre el mismo dato, que en la página van a salir como dos veredictos
  separados de lo mismo. Ninguno de los cuatro registros menciona a los otros.
- cita_de_contexto: «De acuerdo con los datos que nos entregara la propia empresa, en el ano 1995
  ANTEL facturó alrededor de US$ 500:000.000…» (1997-02-03, N.º 2) y «De acuerdo con pala- bras de
  su propio Vicepresidente, el senor Tabaré Viera, en 1995 la empresa facturó más de US$
  500:000.000…» (1996-12-11, N.º 69).
- accion_sugerida: Devolver la atribución al resumen de `[20]`. Fusionar `chequeos[9]` y `[17]` en
  uno solo con las dos fuentes (es literalmente la misma `afirmacion`), o dejar uno y que el otro lo
  referencie. Y aprovechar: los dos registros juntos son un `sin_cambio` documentado sobre ANTEL y
  monopolio, material de giro.

### declaraciones[82] — 1998-05-05 — «¿Cuáles son las razones que motivan estos hechos?…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: El `resumen` cierra con «rechazando que se buscara responsabilizar por eso a los
  organizadores del **acto sindical del 1º de mayo**». En el texto que devuelve el diario dice «los
  organizadores del acto del **12** de mayo», y en ningún lado dice «sindical». La fecha puede ser
  un artefacto de OCR (1º leído como 12) y la lectura del investigador es plausible, pero el
  registro está afirmando una fecha y un carácter que la fuente no dice.
- cita_de_contexto: «organizadores del acto del 12 de mayo. Eso sí nos preocupa, porque si así
  fuera estaríamos equivocándonos y tal vez procediendo con la misma intolerancia que pretendemos
  combatir» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1998-05-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0014).pdf
- accion_sugerida: Abrir el PDF en esa página y leer el número; si es ilegible, escribir «los
  organizadores del acto que se había realizado días antes» y sacar «sindical».

### declaraciones[84] — 1998-09-01 — «A través del Instituto Nacional de Estadística hemos observado que los precios de la educación privada…»
- severidad: corregir
- tipo: contexto_omitido
- objecion: El `resumen` enumera tres asuntos —precios, injerencia en materias extracurriculares y
  «las condiciones de seguridad de las camionetas escolares»— y la `cita` solo cubre el primero.
  Los otros dos pueden estar en el turno, pero el registro no los respalda con nada citable, y el
  tercero es una imputación de seguridad sobre un servicio.
- cita_de_contexto: la cita del registro cubre solo el tramo de precios —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1998-09-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0043).pdf
- accion_sugerida: O recortar el resumen a lo que la cita sostiene, o partir en dos declaraciones
  con su cita cada una.

### declaraciones[60] — 1996-07-02 — «El Estado uruguayo debe decir a los familiares de los desaparecidos…»
- severidad: aviso
- tipo: contexto_omitido
- objecion: El `resumen` nombra a Sanguinetti; la cita dice «el artífice del voto amarillo en
  relación a la ley de caducidad, también hoy es Presidente de la República». La identificación es
  correcta (julio de 1996, segunda presidencia de Sanguinetti) pero es una inferencia del sitio
  sobre una perífrasis del orador, y el registro es `nivel: textual`, que cubre la cita, no la
  identificación.
- cita_de_contexto: «porque el artífice del voto amarillo […] en relación a la ley de caducidad,
  también hoy es Presidente de la República, y podría colaborar para la resolución de esta
  situación en dos tiempos» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-07-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0021).pdf
- accion_sugerida: «al entonces presidente de la República, Julio María Sanguinetti, a quien
  describió como "el artífice del voto amarillo"». Que se vea qué dijo él y qué agrega el sitio.

### declaraciones[74] — 1997-10-01 — «A nuestro juicio, la situación era insostenible…»
- severidad: aviso
- tipo: contexto_omitido
- objecion: «rechazando que fuera una reforma neoliberal» no está en la cita ni en el contexto que
  leí; lo que dice es «una solución "a la uruguaya" que no hay por qué desprestigiar» y que
  mantiene «el criterio fuertemente solidario». Es una lectura razonable de la intención, pero pone
  en boca de él una categoría («neoliberal») que él no usa.
- cita_de_contexto: «Si bien se trata de una reforma muy sui géneris, en cierta forma nos
  enorgullecemos de que se haya podido optar por una solución "a la uruguaya" que no hay por qué
  desprestigiar» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-10-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0070).pdf
- accion_sugerida: «…defendiéndola como una solución "a la uruguaya" que conserva un criterio
  solidario».

### declaraciones[38] — 1998-08-05 — «En Uruguay la situación es, tal vez, más alarmante…»
- severidad: aviso
- tipo: contexto_omitido
- objecion: El resumen dice que «mencionó que el Clearing de Informes había sido vendido en varios
  millones de dólares» sin la atribución que él sí puso. Verificado en el diario: la venta la da «a
  través de datos de la prensa».
- cita_de_contexto: «A través de datos de la prensa nos hemos enterado de que esta empresa se acaba
  de vender en varios millones de dólares.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1998-08-05%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0038).pdf
- accion_sugerida: Agregar «según datos de prensa que citó».

### declaraciones[97] — 1999-06-02 — «El tercer ejemplo es un contrato que tengo en mi despacho…»
- severidad: aviso
- tipo: riesgo_legal
- objecion: La cita nombra a **Skytel** y le atribuye una cláusula asimétrica. El resumen no la
  nombra, y la cita es literal de un diario de sesiones, así que la exposición es baja; queda
  anotado para que el editor lo decida con criterio parejo respecto de `[25]` (American Airlines) y
  `[26]` (Diners): o se citan las tres con el nombre, o ninguna.
- cita_de_contexto: la propia cita del registro —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1999-06-02%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0025).pdf
- accion_sugerida: Criterio único para las tres empresas nombradas, escrito en `razones.md`.

### declaraciones[92] — 1999-03-09 — «Las empresas públicas son gigantes ante los cuales el ciudadano común…»
- severidad: aviso
- tipo: contexto_omitido
- objecion: El resumen dice «Relató un problema personal con una deuda telefónica indebida de
  ANTEL». La cita no contiene el relato. Si el episodio es del propio Barandiarán, es actuación
  pública (lo contó en Sala) y no hay problema de datos personales; conviene igual que la cita o el
  resumen dejen claro de quién es el caso.
- cita_de_contexto: la cita del registro es la conclusión general, no el relato —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1999-03-09%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0004).pdf
- accion_sugerida: Confirmar en el diario de quién es el caso y decirlo.

### declaraciones[65] — 1996-09-25 — «La primera es que consideramos que debería haberse incluido U"n artículo…»
- severidad: aviso
- tipo: sin_objecion
- objecion: Lo dejo anotado porque es el caso de atribución más frágil del lote y lo verifiqué: el
  marcador `SEÑOR BARANDIARAN.-` se perdió en el OCR y el texto arranca inmediatamente después de
  «SEÑOR BALBI.- Negativa.», en una votación nominal. El orador es Barandiarán —el extractor ancló
  el turno ahí, el orden alfabético lo pone después de Balbi, y el propio texto dice «En nombre del
  Nuevo Espacio»—. Sin objeción, pero conviene que el editor lo sepa por si alguien lo cuestiona.
- cita_de_contexto: «SEÑOR BALBI.- Negativa. / Afirmativa, y voy a fundar el voto. En nombre del
  Nuevo Espacio, deseo recal- car lo que expresara en el curso de la discusión general.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-09-25%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0045).pdf
- accion_sugerida: Ninguna.

### chequeos[5] — 1996-06-05 — US$60.000.000 para el Aeropuerto de Carrasco en el Presupuesto 1995-1999
- severidad: corregir
- tipo: documento_previsible
- objecion: El `dato_real` dice «No se relevó en esta corrida el articulado del Presupuesto Nacional
  1995-1999». El Presupuesto Nacional 1995-1999 es la **Ley 16.736**, publicada íntegra en IMPO. La
  afirmación es «el Parlamento votó tal cifra para tal obra»: el documento que la confirma o la
  refuta es el articulado, y existe. Dejarlo en `discutible` por no haberlo abierto es la
  investigación por la mitad que describe CLAUDE.md.
- cita_de_contexto: «ha llevado a este Parla- mento a votar en el Presupuesto Nacional la suma de
  US$ 60:000.000 a fin de reacon- dicionarlo» (fragmento del propio chequeo).
- accion_sugerida: `pnpm fuente https://www.impo.com.uy/bases/leyes/16736-1996` y buscar los
  artículos de la Dirección General de Infraestructura Aeronáutica / Aeropuerto de Carrasco. Si el
  monto figura en la Rendición de Cuentas y no en el Presupuesto, decirlo.

### chequeos[6] — 1996-05-08 — participación de ANCAP en alcoholes: 2,5 % y 24 %
- severidad: corregir
- tipo: documento_previsible
- objecion: El propio orador dice que la cifra «se corrigió **en el día de ayer**», es decir en la
  sesión del **1996-05-07**, que está en la misma Hemeroteca y en el mismo corpus que ya se
  recorrió. El documento que fija de dónde salieron el 2,5 % y el 24 % —y quién los corrigió— es ese
  diario de sesiones, más la versión taquigráfica de la Comisión de Industria donde ANCAP dio el
  dato. No se abrió ninguno de los dos.
- cita_de_contexto: «Creo que en el día de ayer se corrigió esa versión, estableciéndose que el
  porcentaje es el 24% del total de alcohol destinado al consumo humano.» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-05-08%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0010).pdf
- accion_sugerida: Abrir el diario del 1996-05-07 en la Hemeroteca (mismo patrón de URL) y buscar
  «alcohol» y «2,5». Es una sola llamada a `pnpm fuente`.

### chequeos[13] — 1998-05-12 — ANTEL tenía 800.000 suscriptores
- severidad: corregir
- tipo: documento_previsible
- objecion: El `dato_real` dice «No se relevó […] una memoria anual de ANTEL de 1998». El sitio ya
  tiene la ficha `content/empresas/antel.yaml` con **balances desde 1997** (commit dd8233d,
  corrección `2026-09-08-antel-serie-historica-1997-2014`). El documento está adentro del propio
  repositorio y no se miró. La cantidad de líneas o suscriptores es un dato estándar de esas
  memorias.
- cita_de_contexto: «ANTEL tiene 800.000 suscriptores; una sola consulta a la base de datos por
  cada usuario, a US$ 1,5 cada una» (fragmento del propio chequeo).
- accion_sugerida: Mirar `content/empresas/antel.yaml` y el balance/memoria 1998 que esa ficha ya
  cita; si el número de suscriptores no está ahí, decir eso y no «no se relevó».

### chequeos[11] y chequeos[19] — Caja Militar US$230M/año; déficit conjunto Cajas Militar y Policial US$250M
- severidad: corregir
- tipo: documento_previsible
- objecion: Son cifras de ejecución presupuestal de dos organismos del Estado uruguayo en 1997. El
  documento previsible es la **Rendición de Cuentas y Balance de Ejecución Presupuestal de los
  ejercicios 1996 y 1997** (MEF/Contaduría General de la Nación, tomo de organismos), publicada y
  tratada en el Parlamento, más la exposición de motivos del proyecto del Poder Ejecutivo para
  incluir a las Cajas Militar y Policial, que **el propio Barandiarán menciona en la misma
  intervención** y que tiene su repartido y su versión taquigráfica. Ninguna de las dos vías se
  probó.
- cita_de_contexto: «nos hemos enterado […] de que el Poder Ejecutivo estaría retirando o, por lo
  menos, no va a impulsar el propio proyecto que ha presentado sobre la inclusión de la Caja
  Militar y la Caja Policial» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-12-11%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0092).pdf
- accion_sugerida: Buscar la Rendición de Cuentas 1996/1997 en IMPO y en la Hemeroteca, y el
  repartido del proyecto de inclusión de las Cajas. Si el dato no está, el chequeo queda en
  `discutible` **con el documento nombrado y descartado**, que es distinto de no haberlo buscado.

### chequeos[12] — 1997-12-11 — presupuesto militar per cápita de Uruguay mayor que el de Chile o Brasil
- severidad: corregir
- tipo: documento_previsible
- objecion: Existe un dataset público, gratuito y con serie continua desde 1949 que responde
  exactamente esta pregunta: la **SIPRI Military Expenditure Database**, que publica gasto militar
  por país y por año y que, combinada con población (Banco Mundial o INE), da el per cápita de 1997
  para los tres países. CLAUDE.md admite «un dataset público» para calificar. El chequeo no lo
  nombra siquiera.
- cita_de_contexto: «en lo que se refiere a la región, Uruguay tiene un presupues- to militar per
  cápita más alto que el de países como Chile o Brasil» (fragmento del propio chequeo).
- accion_sugerida: `pnpm fuente` sobre el CSV/XLSX de SIPRI y sobre la serie de población. Ojo con
  la trampa: SIPRI publica gasto en % del PBI y en dólares constantes; el per cápita hay que
  construirlo y explicitarlo en «Cómo se calculó», y el resultado bien puede ser `falso`.

### chequeos[15] — 1998-11-11 — los fondos de las AFAP eran unos US$300 millones
- severidad: corregir
- tipo: documento_previsible
- objecion: El BCU publica y publicaba la estadística mensual del Fondo de Ahorro Previsional y la
  memoria anual del régimen de ahorro individual desde 1996. Es el organismo regulador y el dato es
  su serie principal. «No se relevó» no alcanza.
- cita_de_contexto: «los fondos que hoy tienen las AFAP -que son de aproximadamente US$ 300
  millones» (fragmento del propio chequeo).
- accion_sugerida: BCU, Superintendencia de Servicios Financieros (ex Superintendencia de AFAP),
  serie histórica del Fondo de Ahorro Previsional a noviembre de 1998.

### chequeos[20] — 1997-12-17 — exportaciones +16 %, +10 % y +13 % en los tres años previos
- severidad: corregir
- tipo: documento_previsible
- objecion: Es el chequeo con más chance de terminar en `falso` o `impreciso` y el que quedó peor
  resuelto. El propio `dato_real` dice que una búsqueda general (no leída con `pnpm fuente`, así que
  no citable) da 23,6 % de crecimiento medio del trienio y +3,6 % para 1996, «ninguna de las dos
  series coincide». O sea: hay indicios de que el dato es incorrecto y el chequeo queda en amarillo
  porque un PDF del BCU dio `fetch failed` una vez. La serie de exportaciones de bienes 1993-1997
  está en el BCU (balanza de pagos, series históricas), en el INE y en el Anuario Estadístico; y el
  PDF que falló tiene copia en Wayback.
- cita_de_contexto: «las empresas uruguayas han ido incrementando sus exportaciones en los últimos
  tres anos -en un 16%, 1O% y 13%-, no obstante lo cual la desocupación ha venido aumentando» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1997-12-17%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0002).pdf
- accion_sugerida: Reintentar `bvrie.bcu.gub.uy/local/File/REVECO/1997/Informe.pdf` vía Wayback y,
  si sigue caído, la serie de comercio exterior del BCU o del INE. Y cuando esté: este chequeo
  compara tres años de una serie, así que lleva `grafico` (punto 8 de la lista de control).

### chequeos[21] — 1998-09-01 — precios de la educación privada por encima de la canasta (según el INE)
- severidad: corregir
- tipo: documento_previsible
- objecion: La afirmación se la atribuye **al propio INE**. El IPC por rubro («Enseñanza» contra
  índice general) es la publicación más rutinaria del INE y tiene serie histórica descargable. Un
  chequeo que dice «no se encontró la serie del IPC del INE» sobre un dato que el orador atribuye al
  INE es la definición de `documento_previsible`.
- cita_de_contexto: «A través del Instituto Nacional de Estadística hemos observado que los precios
  de la educación privada han experimentando un incremento mayor que el del resto de los bienes de
  la canasta familiar» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1998-09-01%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0043).pdf
- accion_sugerida: INE, IPC por división/rubro, serie 1997-1998 (planilla). `pnpm fuente` lee xlsx y
  csv y cada fila es una cita verificable.

### chequeos[14] y chequeos[16] — cáncer cervicouterino (600 casos / 100 muertes) y nacimientos múltiples (80-100/año)
- severidad: corregir
- tipo: documento_previsible
- objecion: Los dos tienen productor identificable y publicación periódica: el Registro Nacional de
  Cáncer / Comisión Honoraria de Lucha Contra el Cáncer para el primero, y las Estadísticas Vitales
  del MSP y el Anuario Estadístico del INE (nacimientos por tipo de parto) para el segundo.
  `chequeos[14]` además ya trae una cifra de la Revista Médica del Uruguay «sin fecha de publicación
  identificada en la descarga», que no sirve para comparar contra 1998 y sin embargo ocupa el
  `dato_real`.
- cita_de_contexto: «Se detectan actualmente seiscientos casos por año, y cien personas fallecen» y
  «en Uruguay se producen entre ochenta y cien nacimientos múltiples por año» (fragmentos de los
  propios chequeos).
- accion_sugerida: CHLCC / Registro Nacional de Cáncer (informe anual más cercano a 1998) e INE
  (Anuario, nacimientos por tipo de parto). Si no hay dato de 1998, decir qué años sí hay.

### chequeos[7] y chequeos[8] — FOCOEX: crédito de US$137M y comisión del 4 %
- severidad: corregir
- tipo: documento_previsible
- objecion: El informe de la Comisión Investigadora (mayoría y minoría) se reparte y se publica: es
  un repartido del Parlamento y está referido en el propio diario del 1996-08-13, que ya está
  descargado. Además el orador dice que el presidente de FOCOEX, Cunat Arias, declaró en el
  **Congreso de los Diputados de España**, cuyo Diario de Sesiones es público y buscable. Ninguno de
  los dos se abrió, y el `dato_real` los menciona como si fueran inaccesibles.
- cita_de_contexto: «Eso lo admite el senor Cunat Arias […] Insisto: en el Diario de Sesiones del
  Congreso de Dip[utados]» —
  https://biblioteca.parlamento.gub.uy/Publicaciones/sesionescrr/1996-08-13%20-%20DIARIO%20DE%20SESIONES%20DE%20LA%20CAMARA%20DE%20REPRESENTANTES%20(0033).pdf
- accion_sugerida: Buscar el repartido de la Comisión Investigadora en el propio diario (suele ir
  como anexo) y el Diario de Sesiones del Congreso de España de 1995-1996 por «FOCOEX» y «Uruguay».

### chequeos[10] — 1997-11-18 — la mayoría del paquete accionario de PLUNA en manos de VARIG
- severidad: corregir
- tipo: documento_previsible
- objecion: El `dato_real` se apoya en **una nota de opinión de La República del 28/08/2000**. Una
  nota de opinión no es un dato: es la interpretación de un autor, y además dice que VARIG «pasó a
  ser accionista mayoritario **de manera irregular**», una imputación que el sitio estaría
  incorporando de segunda mano. Lo previsible acá es la ley que autorizó la asociación de PLUNA y el
  decreto de adjudicación de 1995 (IMPO), más el informe del Tribunal de Cuentas y la versión
  taquigráfica de la comisión que trató la venta.
- cita_de_contexto: `dato_real.fuentes[0]` es `tipo: nota`, `medio: la-republica`.
- accion_sugerida: IMPO (ley y decreto de la asociación de PLUNA, 1994-1995) y Tribunal de Cuentas.
  Sacar la imputación de irregularidad del `dato_real` o atribuirla explícitamente al autor de la
  nota.

### chequeos[0], [1], [2], [3], [4], [9], [17], [18] — sin objeción de tipo `documento_previsible`
- severidad: aviso
- tipo: sin_objecion
- objecion: `[0]` (genocidio armenio) está bien resuelto: trae la Ley 13.326 desde IMPO como
  `documento_oficial` y explica con precisión que el texto legal no dice «primer país del mundo».
  `[1]` y `[2]` (encuestas de alcohol de 1989 y 1993) no tienen documento previsible: una es anónima
  y la otra es de una psicóloga particular; `discutible` es la calificación correcta. `[9]` y `[17]`
  (ANTEL 1995): la propia ficha `content/empresas/antel.yaml` ya documenta que no hay resultados
  públicos de ANTEL anteriores a 1997, buscados en ANTEL, Wayback, Yumpu, Tribunal de Cuentas y
  Parlamento; el chequeo cita esa búsqueda, que es exactamente lo que corresponde. `[18]` (US$70
  millones de la Cámara de Industrias) no tiene publicación periódica archivada; queda en
  `discutible` bien fundado. `[3]` y `[4]` arrastran el problema de atribución ya objetado en
  `declaraciones[3]` y `[5]`, no de documento.
- accion_sugerida: Ninguna, salvo la fusión de `[9]` y `[17]` ya señalada.

### Los 82 registros restantes — sin objeción individual
- severidad: aviso
- tipo: sin_objecion
- objecion: Con 99 declaraciones, un bloque por registro haría ilegible esta crítica, así que
  agrupo. Los que no aparecen arriba pasaron los cuatro controles: cita exacta contra el diario
  (verificado mecánicamente en los 99), orador correcto (verificado mecánicamente en los 99 y a mano
  en los 15 de riesgo), resumen que no dice más que la cita ni menos, y ninguna persona privada
  nombrada ni denuncia sin etapa. De ellos leí el contexto completo de 51. Nombro los que revisé a
  fondo y no objeto, para que se audite la ausencia de crítica: 0, 4, 7, 8, 9, 18, 21, 22, 27, 29,
  30, 31, 32, 35, 36, 37, 41, 43, 44, 47, 49, 52, 53, 54, 55, 56, 58, 61, 62, 63, 64, 66, 67, 70,
  71, 72, 73, 75, 76, 78, 79, 80, 81, 83, 85, 86, 87, 88, 89, 90, 91, 93, 94, 95, 98.
- accion_sugerida: Ninguna.

---

## Objeciones al lote

### 1. Cuarenta declaraciones sin `_slug`: ids permanentes escritos por una máquina
- severidad: **corregir** · tipo: presentacion

La tranche A puso `_slug` en las 54; la tranche B, en 5 de 45. `derivarId`
(`scripts/lib/inbox.ts:170`) construye entonces el id con `slugificar(resumen)` y seis palabras.
Reproduje la derivación con la lista real de `PALABRAS_VACIAS` y estos son ids que quedarían
publicados **para siempre** (CLAUDE.md: «Nunca se renombran»):

```
barandiaran/1995-07-25-como-miembro-informante-comision-investigadora-sobre
barandiaran/1996-11-05-cuestiono-si-ministro-salud-publica-raul
barandiaran/1997-10-16-sesion-ministro-industria-energia-mineria-sobre
barandiaran/1998-05-05-tras-ultraje-estatua-jose-batlle-ordonez
barandiaran/1999-06-15-voto-contra-derogar-prohibicion-sociedades-anonimas
```

Tres terminan en preposición, uno corta el nombre de una persona por la mitad («raul») y ninguno
dice de qué trata el registro. No hay colisiones y las 22 referencias `chequeos[].declaracion`
resuelven, así que no rompe nada mecánicamente: rompe las URLs del sitio.

**Acción**: el editor (o una segunda vuelta del investigador) escribe `_slug` en los 40, con el
mismo estilo que usó la tranche A (`tema-eje-año`). Es media hora y evita 40 correcciones futuras.

### 2. El criterio de «qué es una posición» no es el mismo en las dos tranches
- severidad: **corregir** · tipo: asimetria

Los números crudos (A: 54 declaraciones sobre 134 turnos largos = 0,40; B: 45 sobre 164 = 0,27) no
prueban nada por sí solos, porque el extractor duplica bloques (en `1995-10-19-0049.md` los turnos 2
y 3 son el mismo texto y los dos cuentan como «largos»). Lo que sí prueba asimetría es comparar
descartes contra registros:

- **Administración interna del Parlamento.** La tranche A registró `declaraciones[9]` (opacidad de
  la Comisión Administrativa) y `declaraciones[14]` (publicidad de los ingresos a la función
  pública), las dos bajo `transparencia-corrupcion`. La tranche B descartó por «administración
  interna del propio Poder Legislativo, no una posición de política pública» el turno 7 del
  **1995-10-19**, el del **1997-07-31** y el del **1999-08-04**. Leí el del 1995-10-19: no es
  trámite. Dice «el Estado es un patrón espantoso», discute una partida de US$5:000.000 contra otra
  del 20 % de esa cifra sin financiación, sostiene «debemos cuidar ese dinero como si fuera
  nuestro» y anuncia el voto del Nuevo Espacio. Con el criterio de la tranche A, entra.
- **Fusión entre sesiones distintas.** La tranche B no registró el **1999-08-18 (N.º 52)** porque
  «repite y amplía» lo del 1999-06-02. La tranche A solo fusionó turnos **dentro del mismo diario**.
  Y el 1999-08-18 no es una repetición cualquiera: es la votación final de la ley de relaciones de
  consumo (luego Ley 17.189), el desenlace del asunto que él venía reclamando desde 1997. Es el
  registro que un giro o una promesa necesitaría anclar.
- **«No hay tema afín» como motivo de descarte.** La tranche B descartó el **1999-04-07 (N.º 10, 4
  turnos largos)** diciendo que es «un debate regulatorio muy acotado sin tema afín en
  `content/temas/`». El brief dice lo contrario: usar el tema más cercano y anotar el faltante. La
  ausencia de un slug no es un criterio editorial.
- **Diarios con turnos largos y cero declaraciones sin motivo escrito**: `1998-03-03-0002` (3
  largos, B), `1996-07-09-0023` (3 largos, A), `1996-08-15-0035`, `1996-09-24-0045`,
  `1999-03-16-0006` (3 largos, A). Verifiqué dos: `1999-03-16` y `1998-03-03` son fundamentos de
  voto para cargos de la Mesa, elogiosos y biográficos — descarte correcto en los dos, y con el
  mismo criterio en las dos tranches, que es lo que uno quiere ver. Los otros tres quedan sin motivo
  escrito.

**Acción**: fijar el criterio en una línea («posición sobre un asunto público, incluida la
administración del propio Parlamento; una sola declaración por debate dentro de un mismo diario, y
una por cada instancia legislativa distinta») y volver sobre 1995-10-19, 1997-07-31, 1999-08-04,
1999-08-18 y 1999-04-07 con ese criterio. Si después de aplicarlo siguen descartados, que el motivo
quede escrito por diario.

### 3. Regla 0: el sitio va a quedar con un diputado del Nuevo Espacio y nadie más de esa época
- severidad: **corregir** · tipo: asimetria

Esto no es culpa de los investigadores ni del brief —que es simétrico y así lo dice— pero es la
objeción que más importa, y la marca el propio validador. Con este lote promovido, `pnpm validar`
imprime:

```
partido            pers.  declar.  años    dec/año
Nuevo Espacio      1      100      5.1     19.63
Partido Nacional   3       47     70.5      0.67
Frente Amplio      9       37    157.8      0.23
Partido Colorado   5        0     51.7      0.00
```

Y avisa «cobertura asimétrica» en los **16 temas**: en todos, el único con mandato en 1995-1999 y
con registros es `barandiaran`, y los que faltan son siempre los mismos cuatro con mandato
solapado: **astori, hierro-lopez, mieres, topolansky**. Un lector que entre a `/temas/economia/` en
el período 1995-1999 va a ver únicamente a un diputado del Nuevo Espacio opinando, y va a concluir
—con razón— que el sitio mira a unos y no a otros. Que el sesgo sea de orden de trabajo y no de
intención no cambia lo que ve.

**Acción simétrica**, en concreto, porque el método ya está probado y es barato: el mismo barrido de
la Hemeroteca 1995-2000 (139 diarios, extracción de turnos, mismo brief) para al menos **un diputado
de cada lema de la XLIV Legislatura** con mandato solapado; los cuatro que el validador nombra son
el punto de partida obvio. Mientras eso no exista: promover este lote está bien —la información es
verdadera y verificable, y esconderla sería peor— pero `cobertura.texto` de la ficha tiene que decir,
con todas las letras, que se recorrió la actuación parlamentaria completa de esta persona y todavía
no la de sus contemporáneos, y por qué. Es el punto 3 de la lista de control aplicado a personas en
vez de a años.

### 4. Presentación
- severidad: **corregir** · tipo: presentacion

Recorrí los trece puntos de la lista de control. Lo que no cumple:

- **Punto 6 (párrafos cortos).** Diez citas pasan de 630 caracteres y una llega a 1.218
  (`declaraciones[96]`); siguen `[68]` 971, `[94]` 815, `[79]` 695, `[5]` 679, `[10]` 672, `[91]`
  645, `[14]` 642, `[60]` 631, `[57]` 628. En una tarjeta de declaración eso es un muro. La cita
  tiene que ser el tramo que fija la posición; el resto va en el enlace al PDF.
- **Punto 6, en los chequeos.** Ocho `dato_real.valor` pasan de 400 caracteres y siete pasan de 550
  (`[20]` 773, `[0]` 691, `[10]` 684, `[14]` 619, `[9]` 615, `[17]` 588, `[19]` 559). El editor los
  tiene que partir en párrafos cortos con el veredicto primero, y escribir `titulo` y `analisis`,
  que hoy no existen en ninguno de los 22.
- **Punto 8 (toda ayuda visual que condense y ninguna por decorar).** `chequeos[20]` compara la
  variación de exportaciones de tres años consecutivos: es un gráfico. `chequeos[11]`, `[12]` y
  `[19]` son cifras entre categorías (Caja Militar vs. Caja Policial; Uruguay vs. Chile vs. Brasil):
  también. Ninguno trae `grafico`.
- **Punto 13 (línea de tiempo vertical filtrable por tema en fichas de personas).** Con 100
  declaraciones en cinco años y 16 temas, esta va a ser la ficha más larga del sitio (hoy la mayor
  es lacalle-pou con 47). Antes de promover conviene abrir `pnpm dev` sobre `/politicos/barandiaran/`
  y mirar si el filtro por tema y el orden por año aguantan ese volumen. Es un aviso de verificación,
  no un defecto detectado.
- **Punto 11 (un hueco no es un cero).** Los 22 chequeos van a salir todos en amarillo `discutible`.
  Un lector va a leer «este señor dice cosas que no se pueden verificar». La página tiene que
  distinguir «no hay documento» de «no lo buscamos», y las objeciones de `documento_previsible` de
  arriba existen precisamente para que la mayoría deje de ser amarilla.

### 5. Los defectos de OCR en las citas: qué hacer sin romper la literalidad
- severidad: **aviso** · tipo: presentacion

El encargo me pide una respuesta concreta y esta es. Las citas del lote están llenas de artefactos:
«SE~OR», «af'lo», «políti- ca», «1O%» (letra O por cero), «US$ 1 :200.000», «serv1c1o», «U"n»,
«L1bermann», «Ley N2 16.713». Están bien así: son literales y son lo que el validador compara.

Lo que **no** hay que hacer es limpiarlas en `cita`. `scripts/lib/texto.ts` normaliza minúsculas,
diacríticos, comillas, guiones, espacios y palabras cortadas por el PDF («políti- ca» ya se resuelve
sola), pero **no** resuelve «af'lo», «SE~OR», «1O%» ni «serv1c1o». Si el editor los arregla en
`cita`, la comparación contra el PDF baja de exacta a aproximada y, en un `diario_de_sesiones`
publicado, eso es error de build (`scripts/validadores/citas.ts`, línea 228). Es decir: limpiar la
cita rompe el lote.

Dos caminos, y recomiendo el primero:

**(a) Un campo aparte, que es cambio de esquema y por lo tanto decisión del mantenedor.** Agregar a
la declaración un `cita_legible` opcional. La página muestra `cita_legible` y deja `cita` —la
literal— bajo un `<details>` de una línea: «ver la transcripción original del diario (OCR)», más el
enlace al PDF. El validador sigue comparando `cita` y nada cambia mecánicamente. Es honesto con el
lector (ve las dos y sabe cuál es cuál) y es el mismo patrón de «lo largo va plegado» del punto 12.

**(b) Un limpiador en el render, sin tocar el esquema.** Un mapa cerrado y corto de artefactos
(`~`→`Ñ`, `f'l`/`f'í`/`fii`→`ñ`, y poco más) aplicado al mostrar. Es tentador y es peligroso: un
reemplazo mecánico de `1`→`l` o de `0`→`o` destruye «US$ 1:200.000», «1O%» y «Ley N2 16.713», que
son justamente las cifras que el Veracímetro chequea. Si se elige este camino, tiene que ser una
tabla explícita, sin reglas generales sobre dígitos, y con la advertencia visible de que es una
transcripción asistida.

En **este** lote: no tocar ninguna cita, salvo la coma de `declaraciones[11]`, que es un error de
copia y no un artefacto de OCR.

### 6. Temas faltantes: cuáles justifican un tema nuevo y cuáles no
- severidad: **corregir** · tipo: presentacion

Conté los registros del lote que caerían en cada uno:

| Propuesta | Registros | Veredicto |
|---|---|---|
| **`economia/seguridad-social`** | ~12 (`[3]`,`[4]`,`[5]`,`[13]`,`[31]`,`[40]`,`[44]`,`[52]`,`[62]`,`[74]`,`[77]`,`[86]`) | **Sí, subtema nuevo.** Es el eje más numeroso del lote después de `economia` a secas, y no es coyuntural: AFAP, Caja Militar, Caja Policial y BPS son materia de todos los gobiernos desde 1995. Hoy están repartidos entre `economia` y `economia/impuestos`, que es donde nadie los va a buscar. |
| **`economia/defensa-consumidor`** | ~9 (`[21]`,`[26]`,`[33]`,`[38]`,`[83]`,`[90]`,`[92]`,`[97]` + el 1999-08-18 que falta) | **Sí, subtema nuevo.** Termina en la Ley 17.189 y el sitio ya tiene el primo hermano `economia/tarifas-publicas`. |
| **`derechos-humanos/datos-personales`** | ~6 (`[16]`,`[35]`,`[36]`,`[38]`,`[50]` y parte de `[21]`) | **Sí, subtema nuevo.** Es la línea que desemboca en la ley 18.331, la misma ley con la que este sitio se regula a sí mismo. Que sea navegable tiene valor propio. |
| **`agropecuario`** (tema nuevo de primer nivel) | 5 (`[17]`,`[93]`,`[94]`,`[96]`,`[98]`) | **Sí.** Hoy están en `economia`, que no explica ni la aftosa (sanidad y comercio) ni la propiedad de la tierra por sociedades anónimas (derecho de propiedad). Cruza economía, medioambiente y relaciones exteriores, así que como subtema de `economia` queda mal colgado. |
| **`sistema-politico`** (tema nuevo de primer nivel) | ~5 (`[9]`,`[14]`,`[18]`,`[54]` y parte de `[77]`) | **Sí.** La reforma constitucional de 1996, el balotaje, las listas calcadas, la Corte Electoral y el ingreso a la función pública están hoy en `transparencia-corrupcion`, que insinúa que hablar del sistema electoral es hablar de corrupción. No lo es, y es un tema sobre el que todos los presidentes del sitio tienen posición. |
| **Género** | 4 (`[0]`,`[70]`,`[72]`,`[49]`) | **No todavía.** `derechos-humanos` los aloja bien y su lista de alias ya cubre la agenda de derechos. Lo que sí falta es agregar a `content/temas/derechos-humanos.yaml` los alias «género», «discriminación laboral por sexo», «Día Internacional de la Mujer», para que la búsqueda los encuentre. Cuando haya una segunda persona con registros, se abre el subtema. |
| **Infraestructura / transporte** | 3 (`[8]`,`[12]`,`[29]`) | **No.** Aviación civil, Aeropuerto de Carrasco y PLUNA son entes y empresas del Estado; `empresas-publicas` es el lugar correcto. (Salvedad menor: `[8]`, sobre la «filosofía militar» en la aviación civil, encaja mejor en `seguridad`.) |

Advertencia de Regla 0 sobre esto: crear cinco temas cuyo único ocupante sea barandiarán va a hacer
que `pnpm validar` imprima cinco filas nuevas de «cobertura asimétrica» con un solo nombre. Eso está
bien —los temas son neutrales y el vacío es visible, que es lo que queremos— pero refuerza la
objeción 3: los temas nuevos y el barrido simétrico de otros legisladores deberían ir juntos.

### 7. Un turno que se perdió entre las dos tranches
- severidad: **aviso** · tipo: contexto_omitido

La tranche A abrió por error `1997-12-17-0002.md` (que es de la tranche B), redactó tres
declaraciones y un chequeo, y los descartó al darse cuenta: sobre el artículo 18 de la ley de
promoción de inversiones, sobre el aporte patronal como «impuesto al trabajo» y sobre **la asimetría
de plazos de mora**. La tranche B sacó dos declaraciones de ese diario (`[79]` y `[80]`), que cubren
las dos primeras. La tercera —los plazos de mora— no está en el lote. Es un turno leído por un
investigador, con posición, que se cayó entre las dos listas.

**Acción**: releer `1997-12-17-0002.md` buscando «mora» antes de cerrar el lote.

### 8. Discrepancias: no hay
- severidad: **aviso** · tipo: sin_objecion

No escribo `discrepancias.yaml`. Una discrepancia exige que un **medio** haya publicado algo que no
coincide con la fuente primaria, y acá las 47 URLs son diarios de sesiones, es decir la primaria
misma. El único medio que aparece en todo el lote es La República, como `dato_real` de
`chequeos[10]`, y es una nota de opinión que no coteja contra ningún documento: por eso es una
objeción de `documento_previsible` y no una discrepancia. Registrar una discrepancia sin el documento
que decide sería exactamente lo que mi rol prohíbe.

---

## Objeciones al brief

Ninguna de Regla 0. El brief `data/corridas/2026-09-09-barandiaran-intervenciones/brief.md` pide
«**todas** las intervenciones con posición», sin filtro de tema, de partido ni de signo, define el
criterio de exclusión por forma (trámite, moción de orden, lectura de texto ajeno) y no por
contenido, y agrega explícitamente «Si algo acá te parece asimétrico, decilo». Las dos tranches lo
cumplieron y lo dejaron por escrito: el lote incluye tanto posiciones que lo muestran defendiendo
políticas del gobierno que su partido integraba (reforma de la seguridad social, minas
antipersonales) como críticas a ese mismo gobierno (ANTEL, gasto militar, aviación civil, agua en
Maldonado, un ministro colorado aliado) y a su propio Parlamento. Verifiqué que no hay sesgo de
selección por signo: de los 51 registros que leí a fondo, 24 son críticos de decisiones de gobierno,
14 son de apoyo y 13 son neutrales o de agenda propia.

Dos observaciones menores sobre el encargo que recibí yo, no sobre el brief del lote:
- El encargo dice que «una tranche descartó una cita que era de Mahía». El caso documentado en
  `notas.md` y que verifiqué es el del Diputado **Chapper** en `1995-03-08-0003.md`. No encontré
  ningún descarte atribuido a Mahía.
- El encargo pide muestrear «al menos 30» declaraciones. Verifiqué las 99 mecánicamente y 51 a
  fondo; lo digo para que quede claro qué respalda cada afirmación de esta crítica y qué no.

---

## Resumen de objeciones

| Severidad | Cantidad | Registros / asuntos |
|---|---|---|
| **bloquea** | 3 | `declaraciones[15]` (FOCOEX / Estellano), `declaraciones[57]` (Banco Pan de Azúcar / Braga), `declaraciones[68]` (Solari / Lasalvia / Sandra Bresque) |
| **corregir** | 24 | Registros: `declaraciones[3]`, `[5]`, `[11]`, `[20]`+`[69]`, `[25]`, `[26]`, `[42]`, `[77]`, `[82]`, `[84]`, `[96]`; chequeos `[5]`, `[6]`, `[7]`+`[8]`, `[10]`, `[11]`+`[19]`, `[12]`, `[13]`, `[14]`+`[16]`, `[15]`, `[20]`, `[21]`. Lote: `_slug` faltantes, criterio asimétrico entre tranches, Regla 0 de cobertura entre partidos, presentación, temas nuevos |
| **aviso** | 8 | `declaraciones[38]`, `[60]`, `[65]`, `[74]`, `[92]`, `[97]`; turno de «mora» perdido entre tranches; sin discrepancias |

De las 24 de `corregir`, **13 son de tipo `documento_previsible`** y todas caen sobre el Veracímetro:
13 de los 22 chequeos quedarían en `discutible` por un documento que existe y no se abrió. Ese es el
trabajo pendiente más grande del lote.

## Cobertura

No hay registros `cobertura` en esta crítica y no escribo `cobertura.yaml`.

El lote no contiene ni una nota de prensa: las 47 URLs distintas son PDF de diarios de sesiones de la
Cámara de Representantes en `biblioteca.parlamento.gub.uy`, medio `parlamento`, tipo
`diario_de_sesiones`. El tono de un diario de sesiones no se mide: el taquígrafo transcribe, no
cubre. La única fuente de prensa del lote es la nota de opinión de La República usada como
`dato_real` en `chequeos[10]`, que no leí en esta corrida y que además no es cobertura sobre
Barandiarán sino sobre PLUNA, así que tampoco corresponde un registro de tono.

Que no haya cobertura de prensa **es en sí un dato para la ficha**: esta persona tiene 505 turnos de
palabra documentados en cinco años y, según las tres corridas hechas sobre ella, una sola nota de
prensa localizada en toda su carrera (LR21, 2000-09-29). Vale decirlo en `cobertura.texto`, porque un
lector que vea la ficha sin sección de prensa tiene que poder distinguir «no lo cubrieron» de «no
buscamos».
