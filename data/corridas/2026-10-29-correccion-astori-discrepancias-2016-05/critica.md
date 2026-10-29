# Crítica — corrida 2026-10-29-correccion-astori-discrepancias-2016-05

Lote: inbox/correcciones/astori-discrepancias-2016-05/
Registros revisados: 2 (discrepancias[0] y discrepancias[1]; sin muestra)
Fuentes releídas con `pnpm fuente --buscar`: comunicado de Presidencia del 23/5/2016 y nota de El Observador del 27/5/2016. `pnpm banco` no aplica (ningún id publicado).

## Resumen
```yaml
- registro: discrepancias[0]
  severidad: corregir
  tipo: contexto_omitido
- registro: discrepancias[1]
  severidad: aviso
  tipo: explicacion_alternativa
```

Las dos cumplen las tres reglas de `docs/colecciones/discrepancias.md` en lo esencial: la primaria es un `documento_oficial` (Presidencia, 23/5/2016) y dice literalmente lo que el registro le atribuye; las dos citas de El Observador son literales y contiguas; no hay verbos de intención («equivocó», «errata», «tergiversó»: ninguno). Lo que sigue son ajustes al `analisis`.

## Objeciones por registro

### discrepancias[0] — 2016-05-27 — «en el Frente Amplio ya empezaron las reuniones para abatir el aumento en esa tercera franja»
- severidad: corregir
- tipo: contexto_omitido
- objecion: El análisis dice que «la nota […] la ubica entre $33.041 y $50.110». La nota da esa franja en el párrafo de redacción, pero en otro párrafo cita a Astori con la franja «entre $ 33.401 y $ 50.100», que coincide con el documento. Es el mismo pasaje que el sitio ya usa como segunda fuente de la declaración `astori/2016-05-26-defensa-suba-irpf-franja-33401-50100` (razones de la corrección 2026-09-16-astori-irpf-2016-05). El análisis de discrepancias[1] sí dice que la nota repite el «31 de junio» en otro párrafo, que es lo que agrava. El de [0] calla lo que atenúa: que la misma nota trae también la cifra correcta. Mismo umbral en los dos sentidos: se dice lo que la nota publicó, entero. La discrepancia sigue en pie (el párrafo de redacción no coincide con el documento), pero el lector tiene que saber que la nota se contradice a sí misma, no que dio una sola franja equivocada.
- cita_de_contexto: "A la franja entre $ 33.401 y $ 50.100 no le estoy definiendo una alícuota algo más alta, entonces afecto la liquidación de todo el impuesto", dijo Astori. (https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500)
- accion_sugerida: Reescribir la segunda y la tercera oración del `analisis`, sin verbos de intención, por ejemplo: «La nota, publicada cuatro días después, la ubica en un párrafo entre $33.041 y $50.110; en otro párrafo cita a Astori con la franja "entre $ 33.401 y $ 50.100", que coincide con el documento. Los dos límites del primer párrafo no coinciden con el documento.» No cambiar `tipo`, `publicado` ni `fuente_primaria`.

### discrepancias[1] — 2016-05-27 — «Hasta el 31 de junio, cuando la propuesta de Rendición de Cuentas ingresará al Parlamento»
- severidad: aviso
- tipo: explicacion_alternativa
- objecion: Lectura inocente que el editor debe tener presente: «antes del 31 de junio» se entiende en la práctica como «hasta el último día de junio», y eso coincide en sustancia con el plazo constitucional (la Rendición de Cuentas se presenta dentro de los seis meses de vencido el ejercicio, o sea, hasta el 30 de junio inclusive). Lo que no coincide es la fecha escrita, que no existe; el plazo de fondo es el mismo fin de junio. El análisis ya dice «fecha que no existe», así que el lector tiene lo esencial. Pero la última oración, «El plazo publicado y el del documento no coinciden», puede leerse como si el medio hubiera dado otro plazo. No bloquea.
- cita_de_contexto: "el camino es largo –la propuesta de Rendición de Cuentas debe entrar al Parlamento antes del 31 de junio y luego cada cámara tiene 45 días para aprobarla-" (https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500); "proyecto de Rendición de Cuentas que deberá ingresar antes del 30 de junio al Poder Legislativo" (https://www.gub.uy/presidencia/comunicacion/noticias/80-recaudacion-adicional-empleados-pasivos-recaera-10-mayores-ingresos)
- accion_sugerida: Opcional: cambiar la última oración por «La fecha publicada no existe y no coincide con la del documento.» Más precisa y sin cambiar el hallazgo.

## Objeciones al lote
- **Umbral (aviso).** Las dos diferencias son chicas: dos dígitos invertidos en el límite inferior (33.041 por 33.400), 10 pesos en el superior y un día inexistente. Registrarlas está bien si el umbral queda fijado así para todos los medios: cualquier cifra o fecha que no coincide con el documento primario, sin piso de magnitud. El editor debería dejarlo escrito en razones, para que el próximo error del mismo tamaño en cualquier otro medio entre igual. La cuenta por medio se normaliza por veces citado (`discrepancias.md`). Además, la otra nota de El Observador que aparece en el corpus sobre el mismo anuncio (23/5/2016, «Aumentos de IRPF afectarán a quienes ganen más de $33.400 nominales») trae la cifra correcta según el fragmento del índice (no la abrí).
- **Simetría entre medios (sin objeción).** Las dos se encontraron de pasada, revisando a Astori, no en un barrido de El Observador. Otras coberturas del mismo anuncio que hay en el corpus (Montevideo Portal 23/5, El País 26/5, Teledoce 6/6) muestran 33.400/33.401–50.100 en los fragmentos de `corpus:buscar`, así que no queda un error equivalente sin registrar en otro medio. No las abrí. «31 de junio» aparece en el corpus de mayo a julio de 2016 solo en esta nota. Ninguna de las dos diferencias favorece ni perjudica a Astori.
- **Documento más decisivo (aviso, no se busca).** El comunicado de Presidencia alcanza como primaria. Para la franja, el documento que decide es la escala del IRPF en BPC (Título 7 del Texto Ordenado, DGI) más el decreto que fijó la BPC de 2016 ($3.340: 10 BPC = 33.400 y 15 BPC = 50.100). Para el plazo, el art. 214 de la Constitución («dentro de los seis meses de vencido el ejercicio»). Sumarlos fortalecería las dos, pero no hace falta para publicar.
- **Presentación del `motivo` de la corrección (aviso).** El `motivo` que propone el brief («la corrección anterior nombró las dos discrepancias con un id que no era el suyo y no se publicaron; se publican con su id») usa «id», que el lector no conoce (`presentacion.md`, texto para el lector). Sugerencia: «La corrección del 16 de septiembre anunció estas dos discrepancias con una dirección equivocada y no llegaron a publicarse; se publican ahora con la suya.» El registro de corrección no está en este lote, así que va como aviso.
- Sin `discrepancias.yaml` nuevo: al releer no encontré otra diferencia contra fuente primaria.

## Objeciones al brief
Ninguna. El brief pide publicar con su id dos discrepancias ya escritas, sin elegir medio, partido ni persona. No viola la Regla 0.

## Cobertura
```yaml
- medio: el-observador
  url: https://www.elobservador.com.uy/nota/fa-planea-alternativa-a-suba-del-irpf-en-sueldos-menores-de-50-mil-2016527500
  fecha: 2016-05-27
  evento: propuesto:ajuste-fiscal-rendicion-cuentas-2016
  politico: astori
  tono: neutral
  justificacion: >-
    La nota atribuye la crítica a fuentes del FA («en el FA consideran que el jerarca deberá deponer sus pretensiones») y da el argumento de Astori con sus palabras («si uno elimina franjas no está afectando solo a la franja que elimina sino a la liquidación de todo el impuesto»), sin juicio propio sobre él.
```
