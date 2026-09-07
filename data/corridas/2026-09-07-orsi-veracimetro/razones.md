# Razones — corrida 2026-09-07-orsi-veracimetro

## Modelo

El editor corrió en Sonnet (`claude-sonnet-5`) por decisión del mantenedor, no en Fable como fija
`.claude/agents/editor.md`. Es la asignación deliberada del experimento en curso (ver `EXPERIMENTO.md`
y la nota en `CLAUDE.md` § Modelos por rol). Queda registrada en `_investigacion.modelo` de cada
registro nuevo y debe quedar en `procedencia.modelo` cuando `pnpm promover` la escriba.

Arranqué desde el estado que dejó un editor anterior cortado por límite de uso: `content/medios/ancap.yaml`
ya estaba completo (propiedad y alineamiento con fuente leída y citada), lo dejé sin tocar. Nada más
del encargo estaba hecho.

## Chequeos (`chequeos.yaml`)

1. **`_slug: ancap-volvio-negativos-diez-anos-2025`** (nuevo, ya lo había agregado el investigador
   en la segunda pasada por el punto 1 de "Objeciones al lote" de `critica.md`: "Falta el chequeo").
   Agregué `calificacion: falso`, `analisis` y `revision: {tier: publicado}`. Es rojo con
   `documento_oficial` (estados financieros auditados de Ancap 2020 y 2024): 2020 fue negativo,
   cuatro años antes de 2024, no diez.

2. **`_slug: ancap-41-millones-2019-118-millones-perdida-2024`** (crítica: chequeos[0], severidad
   `corregir`). El `dato_real` que dejó la segunda pasada del investigador ya resolvía 0.a (la
   "hipótesis" de dos comunicados oficiales contradictorios: es el mismo resultado en dos
   convenciones de tipo de cambio) y 0.d (atribución del tipo de cambio a los estados financieros,
   no a la presentación). Yo agregué: (i) al final de `dato_real.valor`, un párrafo con las causas
   de la pérdida de 2024 (297 días de parada de La Teja, USD 55M resignados por PPI, USD 24M de
   subsidio al supergás), tomado de El Observador y releído con `pnpm fuente` en esta sesión —
   objeción 0.c; intenté sumar también la explicación de la propia presidenta de Ancap en el video
   ("un déficit... tanto operativos como financieros"), pero no tiene `marca_tiempo` verificable
   (no encontré transcripción con marcas de tiempo para ese segmento) y la saqué para no dejar una
   fuente `tipo: video` sin `marca_tiempo`; (ii) `calificacion: verdadero` con `analisis` que dice
   explícitamente qué convención usa cada cifra (39,2/118,4 al cierre; 41,7/129,7 al promedio) —
   es la condición que pone la objeción 0.e ("verdadero es defendible... con eso escrito"), y es
   el mismo estándar que aplicó el crítico gemelo al "75%" de Lacalle Pou. Saqué el `_faltante:
   dato_oficial` porque los dos números (peso auditado + tipo de cambio auditado) son oficiales;
   lo que no hay es un documento que diga "41 millones" en dólares de forma literal, y eso ya
   queda dicho en el propio `dato_real.valor` heredado de la segunda pasada.

3. **`_slug: prestamo-160-millones-deuda-255-millones-ancap-2025`** (crítica: chequeos[1], severidad
   `corregir`). Reescribí `afirmacion`: decía "autorizó un crédito para Ancap por 160 millones"; la
   primaria (mismo video) y El Observador (ya citado en el `dato_real` heredado) dicen que la
   autorización fue por hasta 200 millones, de los que Ancap tomó 160 — objeción 1.a. Agregué a
   `dato_real.valor`: la distinción entre "deuda total" (lo que dice Orsi) y "deudas financieras"
   frente al pasivo total del balance (US$ 232M vs. US$ 696M, con nueva fuente y cita del "Total de
   pasivo") — objeción 1.b; y el contexto sobre la palabra "novedad" (El Observador: la operación
   fue pública, hubo préstamos similares en 2020 y agosto de 2023) — objeción 1.d. Reemplacé la
   `cita` de `dato_real.fuentes` que era una fila de tabla sin encabezado ("TOTAL 7.316.594.888...")
   por el bloque contiguo completo de la Nota 21 con su encabezado ("Nota 21 – Deudas financieras...
   TOTAL...") — objeción 1.e; preferí extender la cita en vez de citar las dos líneas rotuladas que
   sugería el crítico porque esas dos líneas no son contiguas entre sí en el documento (están
   separadas por otras partidas del balance) y unirlas hubiera violado la regla de cita contigua.
   `calificacion: discutible` con `analisis` y `notas_internas` que explican por qué (no hay estado
   financiero con corte a la fecha de la conferencia) — objeción 1.f, tal como pedía el crítico.

4. **`_slug: iva-2-por-ciento-tarjetas-debito-2024`** (crítica: chequeos[2], severidad **`bloquea`**).
   Reescribí `afirmacion`: quitié el hecho futuro fabricado ("sin devolverlo antes de dejar el
   gobierno" sobre un gobierno que el 18/11/2024 todavía no se había ido) y lo dejé como lo que es,
   una pregunta sin respuesta — objeción 2.a. Reescribí `dato_real.valor`: (i) corregí la atribución
   errónea que el crudo mantenía sin cambios — "3,81%-4%" es lo que dijo **Lacalle Pou** en una
   entrevista con Subrayado, no lo que dice el documento del MEF, que da **4,81%** para el primer
   quintil; releí Ámbito con `pnpm fuente` para confirmarlo y agregué las dos citas por separado —
   objeción 2.d; (ii) sobre el período "2017-2020" que el crítico cuestionaba porque el decreto por
   sí solo no lo prueba (objeción 2.c-i y 2.c-v): releí el mismo artículo de Ámbito y encontré que
   sí lo sostiene con otro pasaje ("en 2015 pasó a tres y en 2016 bajó a dos puntos. En enero de
   2017, el descuento del 4% volvió a implementarse"), así que mantuve "2017" pero até la fecha a
   esa fuente en vez de dejarla sin respaldo; (iii) saqué la afirmación "que siguen vigentes hoy"
   porque no la pude sostener con lo que leí esta sesión; (iv) agregué al `analisis` la tasa general
   del IVA (22%, sin cambios) y el encuadre del MEF ("fin de un subsidio") junto con el de Ámbito en
   voz propia ("un aumento del IVA"), que pedía la objeción 2.c y el punto 5 del veredicto del
   crítico. No pude resolver 2.e (una sola fuente, un solo grupo): el candidato que sugiere el
   crítico (Telemundo/Canal 12, grupo `cardoso`) no está localizado como pieza propia en esta
   corrida y no me correspondía salir a buscarlo (es tarea de investigador, no de WebSearch de
   editor). `calificacion: discutible`, **`tier: probable`** — el `bloquea` de contexto/atribución
   queda resuelto, pero el `_faltante: segunda_fuente` no, así que no llega a `publicado` por la
   regla de dos grupos para `reportado`.

5. **Camioneta (`orsi/2026-05-26-consultado-prensa-sobre-descuento-usd-25`, crítica: chequeos[3],
   severidad **`bloquea`**).** Saqué el registro completo de `chequeos.yaml`. Coincido con
   `_descartar` (ya escrito por el investigador) y con el crítico (3.a-g): la `afirmacion` original
   calificaba en el Veracímetro una cifra de la prensa, no una afirmación de Orsi, que se negó a
   dar cifra ("Cuando usted vea la factura, ahí va a decir qué precio es"); el esquema define
   `politico` como quien hizo la afirmación. Trasladé el material a
   `hipotesis/orsi/camioneta-jutep-denuncias-anonimas.yaml`, que ya existía y trata exactamente este
   tema (no creé un archivo nuevo para no duplicar): agregué la cadena de cifras 78.990/54.000/25.000
   con su fuente, la corroboración de la declaración jurada (78.990 × 43 = 3.396.570, ya calculada
   por el investigador), la respuesta de Jorge Díaz, el anuncio de la Jutep del 01/06/2026 (releído
   con `pnpm fuente`, con la etapa y fecha que pide la regla de casos), el dato -nuevo, de Infobae-
   de que Presidencia habría enviado la factura a Radio Carve (no localizada de forma independiente),
   una explicación alternativa sobre la coincidencia aritmética de los 25.000 (3.e del crítico) y un
   cabo suelto sobre la declaración jurada 2024 de Orsi, no leída en ninguna corrida todavía.

## Declaración (`declaraciones.yaml` → corrección sobre contenido publicado)

Reescribí `titulo` y `resumen` de la copia de `orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`
(objeción 1 de "Objeciones al lote", severidad de facto `corregir` aunque el crítico no la puso en
la lista por registro porque es una objeción al lote, no a un chequeo). Antes: "Ancap volvió a
números negativos tras diez años..." / "Orsi informó que Ancap volvió a tener resultados negativos
después de diez años..." — ambos en voz propia del sitio, y el dato es falso (2020 fue negativo,
cuatro años antes). Ahora atribuyen el tramo textual a Orsi entre comillas ("después de 10 años"),
sin tocar `cita` ni `evidencia`, para que el `fragmento` del chequeo 1 (arriba) siga apareciendo tal
cual en el `cita` (no lo toqué) y la marca del Veracímetro caiga sobre la frase correcta. Mismo
criterio que aplicaría a cualquier otro político con un dato falso en su título. Esto va a
`content/correcciones/` (tipo `cambio_de_rating`/corrección de contenido) sobre el id existente
`orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados`; no es un registro nuevo.

## Discrepancias (`discrepancias.yaml`)

Las escribió el crítico con `revision: {tier: probable}` ya puesto. Las revisé como cualquier
registro del lote (cita contigua contra fuente primaria, sin verbos de intención) y coincido con
las tres: la de `presidencia` (2020) queda `probable` porque no leímos los balances de 2015-2017
que sostendrían o no "cinco años consecutivos de superávit" del titular; las dos de la camioneta
(`montevideo-portal` y `caras-y-caretas`) quedan `probable` porque falta leer la declaración jurada
2024 de Orsi para saber si el "USD 54.000" que ambas atribuyen a la declaración jurada 2025 sale de
comparar las dos declaraciones. No tenían `_slug`; se lo puse a cada una. No cambié nada de fondo.

## Cobertura (`cobertura.yaml`, nuevo)

El crítico dejó 8 registros propuestos dentro de `critica.md` (no en un archivo aparte). Revisé cada
uno como cualquier registro del lote y verifiqué con `pnpm fuente`, en esta sesión, cada cita de
`justificacion` que no coincidía ya con una `cita` verificada en otro YAML del lote (subrayado,
montevideo-portal ×2, caras-y-caretas, el-pais/Díaz: las cinco calzan exactas contra la fuente).

- **Excluí 1 de los 8** (El País, 02/04/2025, "Ancap tuvo en 2024 las mayores pérdidas...",
  propuesto con `politico: lacalle-pou`): el propio crítico avisó que la atribución era discutible.
  Es un análisis contable del ejercicio sin ninguna frase que cite, valore o critique a un político;
  el mismo criterio (¿hay una frase del medio que trate lo que dijo o hizo una persona?) lo aplicaría
  igual si estuviera etiquetado a Orsi. No es una decisión sobre a quién favorece.
- **De los 7 restantes, solo 1 pasa `pnpm validar`** (montevideo-portal, 18/11/2024, IVA, con
  `evento: elecciones-2024`, que ya existe en `content/eventos/` y cubre el rango 2024-10-27 a
  2024-11-24). Los otros 6 referencian un `evento` que el crítico marca como "propuesto" y que no
  existe (`balance-ancap-2024` ×2, `rendicion-de-cuentas-asamblea-general-2023` ×1,
  `descuento-camioneta-orsi-2026` ×3); comprobé con `pnpm validar --inbox` que `evento` es un campo
  obligatorio del esquema (falla con "Campo obligatorio ausente" si se omite), así que no hay forma
  de dejarlos válidos sin crear esos eventos. Crear `content/eventos/` no está en el alcance de
  escritura del editor ("la única parte de `content/` que sí escribís son... `content/medios/` y
  `content/referentes/`"), así que no los creé. Saqué esos 6 de `cobertura.yaml` para que el archivo
  valide y dejo el texto completo (ya con citas verificadas esta sesión) más abajo para que quien
  cree los eventos no tenga que rehacer la lectura de fuentes:

  ```yaml
  - _slug: subrayado-anuncia-balance-ancap-2025
    medio: subrayado
    url: https://subrayado.com.uy/volvemos-despues-10-anos-tener-numeros-negativos-ancap-dijo-orsi-e-informo-una-deuda-total-255-millones-dolares-n975389
    fecha: 2025-04-25
    evento: balance-ancap-2024   # crear en content/eventos/ primero
    politico: orsi
    tono: neutral
    justificacion: >-
      Crónica en voz atribuida, sin frase propia del medio que valore al presidente: "El presidente
      Yamandú Orsi llamó este viernes al mediodía a una conferencia de prensa junto a la ministra de
      Industria Fernanda Cardona y la presidenta de Ancap Cecilia San Román para presentar las cifras
      del último balance de la empresa estatal de combustibles". Incluye la aclaración que exculpa al
      gobierno anterior ("No puedo decir que nos ocultaron cifras").

  - _slug: el-observador-lo-que-el-gobierno-no-dijo-ancap-2025
    medio: el-observador
    url: https://www.elobservador.com.uy/economia-y-empresas/lo-que-el-gobierno-no-dijo-ancap-que-muestran-los-numeros-del-balance-la-empresa-n5995973
    fecha: 2025-04-26
    evento: balance-ancap-2024
    politico: orsi
    tono: desfavorable
    justificacion: >-
      El medio contradice al presidente en voz propia, no atribuida: "Si bien el presidente señaló
      que, a su entender, ese 'no es un dato común' y representó 'una novedad' para el nuevo
      directorio de Ancap, la solicitud del préstamo se trató de una operación que fue pública en su
      momento". Y agrega, también en voz propia: "no se explicó que Ancap ha recurrido a préstamos en
      tres oportunidades recientes".

  - _slug: ambito-numeros-reduccion-descuento-iva-2023
    medio: ambito
    url: https://ambito.com/uruguay/los-numeros-detras-la-reduccion-del-descuento-iva-tarjetas-debito-n5668404
    fecha: 2023-03-08
    evento: rendicion-de-cuentas-asamblea-general-2023
    politico: lacalle-pou
    tono: neutral
    justificacion: >-
      Presenta largamente los datos del MEF que sostienen la posición del presidente, pero en voz
      propia describe la medida con el término que él rechaza: "la compleja situación fiscal del país
      llevó a un aumento del IVA para las tarjetas de débito, haciendo que el descuento pasara del 4%
      al 2%". Distingue con cuidado lo que dijo el presidente ("Un 3,81%, o un 4%") de lo que dice el
      documento oficial (4,81%). No hay frase del medio que lo valore en ninguna dirección.

  - _slug: montevideo-portal-orsi-camioneta-descuento-2026
    medio: montevideo-portal
    url: https://www.montevideo.com.uy/Noticias/-Cuando-usted-vea--Orsi-hablo-sobre-la-camioneta-que-compro-con-US-25-000-de-descuento-uc963282
    fecha: 2026-05-26
    evento: descuento-camioneta-orsi-2026
    politico: orsi
    tono: neutral
    justificacion: >-
      El medio afirma el descuento en voz propia ("la adquirió a US$ 25.000 menos que el precio de
      lista que figura para el modelo") y cierra con una insinuación opositora sin respuesta ("El
      senador del Partido Nacional Sebastián da Silva consideró que no quiere 'saber qué más puede
      haber en declaraciones juradas'"), pero incluye la explicación de Presidencia ("se trató de una
      'gentileza'") y no hay una frase del medio que valore al presidente en una dirección. La
      afirmación en voz propia del monto motiva la discrepancia registrada aparte en discrepancias.yaml.

  - _slug: caras-y-caretas-camioneta-factura-forma-pago-2026
    medio: caras-y-caretas
    url: https://www.carasycaretas.com.uy/sociedad/la-camioneta-la-polemica-orsi-mostro-factura-y-entrego-vehiculo-como-forma-pago-n95840
    fecha: 2026-05-27
    evento: descuento-camioneta-orsi-2026
    politico: orsi
    tono: neutral
    justificacion: >-
      Mismo texto de base que Montevideo Portal, con dos agregados: los datos que aporta Presidencia
      sobre la forma de pago y una observación del medio sobre lo que falta, no sobre el presidente:
      "Hasta el momento, Presidencia no informó si el descuento recibido formó parte de una política
      comercial habitual de la empresa o si se trató de una condición particular para la operación".
      Es constatación, no valoración; neutral con el mismo umbral que las demás.

  - _slug: el-pais-diaz-descuento-camioneta-etica-publica-2026
    medio: el-pais
    url: https://elpais.com.uy/informacion/politica/descuento-de-us-25-000-a-camioneta-de-orsi-compra-esta-ajustada-al-codigo-de-etica-publica-dice-jorge-diaz
    fecha: 2026-05-28
    evento: descuento-camioneta-orsi-2026
    politico: orsi
    tono: neutral
    justificacion: >-
      Es la única de las tres notas del caso que usa condicional para el hecho no probado: "El
      mandatario habría recibido un descuento de US$ 25 mil dólares por adquirir dicho vehículo".
      Titula con la defensa del gobierno y le da espacio completo, y después expone el pedido de
      informes opositor con sus preguntas. Sin frase propia del medio que valore al presidente.
  ```

## Medios (semillas en `content/`)

- `content/medios/ancap.yaml`: ya estaba completo (editor anterior); lo revisé, tiene `propiedad` y
  `alineamiento` con fuente y cita leídas con `pnpm fuente`; lo dejé sin cambios.
- `content/medios/miem.yaml`: nuevo. `tipo: estatal`, `grupo: estado-uruguayo`,
  `alineamiento.etiqueta: estatal`, siguiendo el modelo de `presidencia.yaml` que indicaba el
  encargo. Fuente y cita de `gub.uy/ministerio-industria-energia-mineria/institucional/cometidos`,
  leída con `pnpm fuente` en esta sesión.

## Hipótesis

- `hipotesis/orsi/camioneta-jutep-denuncias-anonimas.yaml` (ya existía, abierta el 2026-09-04):
  actualizada con el material descartado del chequeo de la camioneta (ver arriba). No creé un
  archivo nuevo para el mismo tema.
- `hipotesis/orsi/disputa-cifras-ancap-abril-2025.yaml` (ya existía, abierta el 2026-09-04): agregué
  evidencia en contra de la hipótesis "cifras en disputa" para la parte de las cifras de 41/118
  millones (el balance auditado las confirma bajo las convenciones de tipo de cambio de la propia
  Ancap), dejando explícito que el otro cabo suelto de esa hipótesis -la disputa por el monto de la
  deuda (Coalición Republicana, "100 millones menos") y la cifra de 130,2 millones que da Ámbito
  para la pérdida de 2024- sigue sin resolverse, no la cerré ni cambié su `estado`.

## IDs completos (para la corrección y el resto del lote)

```
correcciones/<id-a-definir>              # afecta: declaraciones/orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados
chequeos/orsi/2025-04-25-ancap-volvio-negativos-diez-anos-2025
chequeos/orsi/2025-04-25-ancap-41-millones-2019-118-millones-perdida-2024
chequeos/orsi/2025-04-25-prestamo-160-millones-deuda-255-millones-ancap-2025
chequeos/orsi/2024-11-18-iva-2-por-ciento-tarjetas-debito-2024
discrepancias/presidencia/2020-02-27-resultado-operativo-etiquetado-como-resultado-ejercicio-ancap-2019
discrepancias/montevideo-portal/2026-05-26-atribuye-54000-a-declaracion-jurada-camioneta
discrepancias/caras-y-caretas/2026-05-27-atribuye-54000-a-declaracion-jurada-camioneta
cobertura/montevideo-portal/2024-11-18-orsi-tras-debate-no-subir-impuestos-2024
medios/miem
```

## Cambios de forma

Ninguno: el paso 1 (correcciones de forma) ya venía vacío según el encargo, y no encontré erratas
de fecha/tipeo propias en lo que edité.

## Aviso 3.g del crítico (el que pide no perder en una corrida futura)

`notas.md` ya lo corrigió en la segunda pasada y lo repito acá por la misma razón que lo pidió el
crítico ("es el más importante de todo el informe"): la nota de El País del 28/05/2026 sobre la
camioneta (`descuento-de-us-25-000-a-camioneta-de-orsi-...-jorge-diaz`) **no sirve** como segunda
fuente para subir de `probable` a `publicado` el registro publicado
`orsi/2026-05-26-consultado-prensa-sobre-descuento-usd-25` (`content/declaraciones/`): no contiene
la cita de Orsi de esa rueda de prensa ("Cuando usted vea la factura..."), solo la respuesta de
Jorge Díaz. Agregarla a `evidencia.fuentes` pasaría la validación mecánica de citas y le daría un
segundo grupo de medios sin que la fuente respalde lo que el registro dice que Orsi dijo.

## Pendientes / no resueltos

- **Objeción 2.e (crítica, chequeo IVA):** una sola fuente, un solo grupo. Candidato identificado
  (Telemundo/Canal 12, grupo `cardoso`) no localizado como pieza propia; queda para el investigador.
- **Aviso del crítico sobre `declaraciones.yaml`:** abrir una declaración nueva para el debate del
  17/11/2024 (con la frase completa "compra por tarjetas" y video propio) no lo hice: es trabajo de
  investigador, no de editor, y el aviso es severidad `aviso`, no `corregir`/`bloquea`.
- **Asimetría aguas arriba (punto 6 de "Objeciones al lote"):** el `dato_real` del chequeo de IVA
  documenta una cifra chequeable de Lacalle Pou (3,81%/4% contra el 4,81% oficial) que no se chequea
  porque el expediente es de Orsi. No abrí un chequeo para Lacalle Pou: está fuera del alcance de
  este lote (brief de Orsi) y es una cuestión de diseño del Veracímetro, no de este registro.
- **Archivado:** las páginas y PDF de `ancap.com.uy` (y el nuevo `impo`/`miem` ya usados) vuelven de
  `pnpm validar --red` con estado HTTP verificado, pero varias siguen `sin archivo` (Wayback); es
  tarea de `pnpm archivar`, que no corro.
- **Eventos faltantes:** `balance-ancap-2024`, `descuento-camioneta-orsi-2026` y
  `rendicion-de-cuentas-asamblea-general-2023` no existen en `content/eventos/`; bloquean los 6
  registros de cobertura documentados arriba. Crearlos no es tarea del editor.


## Cambio de forma del orquestador

- declaraciones/orsi/2025-04-25-orsi-informo-ancap-volvio-tener-resultados: el título que dejó el editor arrancaba con "Dice que…"; se quita el arranque para que lea como los otros 84 títulos del sitio, y las comillas sobre «después de 10 años» siguen marcando que el dato es de Orsi y no del sitio. Contenido idéntico.
