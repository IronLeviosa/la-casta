# Razones de edición — corrida 2026-09-05-lacalle-pou-economia-combustibles

Editor: Sonnet (claude-sonnet-5), por instrucción explícita del encargo de esta corrida (no por
decisión propia: `CLAUDE.md` asigna Fable al rol de editor). Lote: tres carpetas de un mismo
backfill de El País (t1 2020-2021, t2 2022-2023, t3 2024-2025), criticadas como una unidad en
`inbox/lacalle-pou/economia/combustibles/2026-09-05/critica.md`.

## Política transversal aplicada (objeción de lote 2 de critica.md)

Ningún registro nuevo de este lote tiene dos testigos verdaderamente independientes: donde hay dos
o tres fuentes de distinto `grupo`, siempre remiten a un mismo origen (un tuit, un video de
Telemundo, una entrevista de Subrayado, una gacetilla de Presidencia). Regla aplicada por igual a
todos los registros, favorables y desfavorables: si las fuentes son literales en su propio texto y
cubren la misma afirmación (pasan a y b del criterio de precedente de critica.md), el registro
conserva el tier que le correspondería por sus demás méritos y se documenta el origen único en
`notas_internas`, siguiendo el precedente ya publicado en `2022-05-28-espalda-ancap-termino.yaml`.
Cuando además falta la afirmación específica en la segunda fuente (falla b, "segunda fuente
falsa": T2 declaraciones[2] Mercedes, T3 declaraciones "Ancap está mejor"), sí bajé tier o partí el
registro, porque ahí falta la evidencia, no solo la independencia del testigo.

## Cambios sustantivos sobre el crudo, por registro

- T1 declaraciones[0] (2020-07-24): cambié `cita` (y la de su única fuente) de "Los espero el
  miércoles..." al pasaje "sabemos que hay ineficiencias, sabemos que hace 20 años que se pierde
  ...", que sí trata el tema del registro; la frase de la reunión pasó al `resumen`. Motivo:
  objeción `corregir` T1 declaraciones[0] (cita_fuera_de_contexto).
- T1 declaraciones[1] (2021-04-12): corregí en el `resumen` "las ministras de Economía e
  Industria" por "la ministra de Economía y el ministro de Industria" (Paganini es varón). Motivo:
  objeción `corregir` T1 declaraciones[1].
- T1 declaraciones[2] (2021-06-01): agregué al `resumen` el desmentido público de Walter Sosa
  (02/06/2021) y amplié la cita de montevideo-portal para cubrir la afirmación completa sobre la
  oposición en Ancap. Motivo: bloqueante T1 declaraciones[2] — el registro difundía la acusación
  citando dos notas construidas alrededor de su desmentido, sin incluirlo.
- T1 declaraciones[5] (2021-09-16): reescribí el `resumen` para no resolver de forma unívoca el
  referente de "la" en "Tenemos que modernizarla" (la propia Presidencia lo hace de forma más
  amplia en el título que en el cuerpo) y bajé `tier` a `probable`. Motivo: objeción `corregir` T1
  declaraciones[5] — una cita de dos palabras con referente ambiguo no debería sostener sola un
  registro `textual`.
- T1 declaraciones[7] (2021-10-10, "Desmantelar no es asociarlas"): agregué la gacetilla de
  Presidencia como fuente `documento_oficial` (cita íntegra verificada), subí `nivel` de
  `reportado` a `textual` y retiré `_faltante: segunda_fuente`. Motivo: objeción `corregir` T1
  declaraciones[7] — El Observador reproduce esa misma gacetilla y lo dice.
- T1 declaraciones[8] (2021-12-14): reescribí el `resumen` para incluir la concesiva que el
  titular de El País omite ("algunas huelgas que, aun teniendo un motivo..."). Motivo: objeción
  `corregir` T1 declaraciones[8] (cita_fuera_de_contexto, el resumen heredaba el recorte del
  titular).
- T1 declaraciones (las 9): agregué `_slug` a todas (no tenían). Motivo: objeción de lote 9
  (higiene de ids) — sin `_slug`, `promover` derivaría ids poco legibles de `slugificar(resumen)`.
- T1 promesas.yaml: vacié el archivo (`[]`). Motivo: bloqueante T1 promesas[0] — reproducía la
  promesa ya publicada `lacalle-pou/no-aumentar-combustibles`; el crítico verificó que el id que
  `promover` derivaría del `texto` (`no-aumentar-precio-combustibles-si-es`) no colisiona con el
  publicado, así que escribiría un duplicado huérfano sin `estado` ni `fundamentacion`. Encargo
  explícito del orquestador.
- T2 declaraciones[0] (Minas, "horno podrido"): cambié la `cita` de El Observador: la original era
  el tuit incrustado de @TelemundoUY, no prosa propia del medio; ahora es la prosa del cuerpo
  ("Está dando déficit hace años —fue una de las primeras cosas..."). Motivo: objeción `corregir`
  T2 declaraciones[0].
- T2 declaraciones[2] (2022-03-30, Mercedes): cambié la `cita` de El Observador por el pasaje que
  sí es literal de ese medio, agregué `_faltante: segunda_fuente` y bajé `tier` a `probable`.
  Motivo: objeción `corregir` T2 declaraciones[2] — la cita original de El Observador no contenía
  una palabra del político (segunda fuente falsa); la nueva tampoco corrobora sus palabras, solo el
  hecho.
- T2 menciones[0] (Gerardo Rodríguez, "Nunca te vi quejarte"): agregué teledoce como segunda
  fuente (cita propia, verificada) y retiré `_faltante`. Motivo: objeción `corregir` T2
  menciones[0] — el `_faltante` se había puesto con un criterio más estricto que el aplicado a las
  fuentes de El País del mismo lote.
- T3 declaraciones[0] (2024-03-08, "El país es uno..."): reescribí el `resumen` para atribuir a El
  País, no al propio Lacalle Pou, la identificación de "legisladores de la coalición". Fijé
  `cargo_en_ese_momento` a "presidente" (decía "presidente de la República"). Motivo: aviso T3
  declaraciones[0] + objeción de lote 9 (unificación de `cargo_en_ese_momento` con el resto del
  corpus).
- T3 declaraciones[1] ("jugamos como nunca..."): agregué al `resumen` que él mismo atribuye la
  frase a un tercero ("como decía un amigo mío") y que la aclaración entre paréntesis sobre la LUC
  es de la redacción de El País. No toqué la `cita`: es un tramo contiguo del cuerpo original y no
  corresponde sacarle palabras del medio aunque sean una aclaración del redactor; la objeción se
  resuelve anotando, no editando la cita. Fijé `cargo_en_ese_momento` a "presidente". Motivo:
  objeción `corregir` T3 declaraciones[1].
- T3 declaraciones[2] ("Ancap está mejor..."): partí el registro en dos. "Yo recomendaría no ceder
  en este reclamo" (dos fuentes, El País y Montevideo Portal) y "Ancap está mejor, que hace seis
  años" (solo El País, `_faltante: segunda_fuente`, `tier: probable`). Motivo: bloqueante T3
  declaraciones[2] — Montevideo Portal no contiene la segunda oración (verificado en esta sesión:
  "sin coincidencias en esta nota" sobre el texto completo), que es la afirmación sustantiva y
  favorable del registro; dejarla así habría permitido publicar esa afirmación con una sola fuente
  real.

## Cambios de forma

- T1 declaraciones: `retrieved_at` de las citas que releí y no cambié de contenido se actualizó a
  2026-09-06 solo en las fuentes que efectivamente reabrí con `pnpm fuente` en esta sesión (no en
  las que dejé sin tocar).
- Sin otros cambios de fecha, ortografía o formato.

## Registros creados

- `content/referentes/gerardo-rodriguez-fancap.yaml`: pedido en `referentes_faltantes` de
  `2026-09-05-t2/notas.md`. `descripcion` documenta la variante de cargo entre fuentes
  ("presidente" vs. "secretario general" de Fancap) tal como pidió el investigador; no incluye
  `propiedad` ni `alineamiento` porque esos campos son de medios, no de referentes (ver
  `content/referentes/daniel-martinez.yaml` como formato de referencia).
- No creé el referente opcional `fancap` (organización): el investigador lo marcó opcional y no es
  necesario para validar ningún registro de este lote.

## Giros e hipótesis

- No armé ningún `giros.yaml` con contenido (los tres quedaron `[]`). Los tres candidatos de las
  `notas.md` no llegan al umbral: (1) 2021-07-20 vs. 2021-07-31 no son la misma afirmación (una es
  un mensaje de expectativa, la otra un hecho sin cita suya) — pasa a hipótesis. (2) 2021-06-01 vs.
  2021-08-03 (tono técnico-resignado vs. personal-concesivo): evalué y decidí no abrir hipótesis;
  el propio investigador lo plantea como "podría ser X o simplemente Y" sin una segunda lectura
  alternativa propia, y las dos declaraciones no afirman lo mismo (una es un pronóstico sobre
  Ancap, la otra una concesión sobre las críticas), así que ni siquiera compiten como giro. (3)
  2021-11-16 + 2024-03-08 vs. 2025-05-07 (postura sobre Ancap): no hay contradicción textual
  directa sobre el mismo objeto (afirmación de resultados concretos vs. remisión genérica a
  "balances"), así que tampoco es giro — pasa a hipótesis.
- Abrí `hipotesis/lacalle-pou/suba-combustibles-11-dias-tras-mensaje-alivio-2021.yaml` (candidato 1)
  y `hipotesis/lacalle-pou/postura-ancap-defensiva-a-evasiva-posmandato.yaml` (candidato 3).
- La suba de Mercedes (T2 declaraciones[2], 30/03/2022) es evidencia adicional para el giro ya
  publicado `content/giros/lacalle-pou/no-subir-combustibles-2022.yaml`, tal como señala
  `2026-09-05-t2/notas.md`. No lo sumé porque ese giro ya está publicado y modificar contenido
  publicado no es parte de este lote (iría por `content/correcciones/`).

## material_para_correccion_promesa (afecta: promesas/lacalle-pou/no-aumentar-combustibles)

Fuera de mi alcance por instrucción explícita del encargo: la promesa publicada no documenta
ningún aumento de precio pese a haber al menos seis en el mandato. Material verificado en esta
sesión (URL + cita), para quien arme la corrección vía `content/correcciones/`:

- 2021-06-07, `en_contra` (12%): ya estaba en el `promesas.yaml` del tramo 1 (ahora vaciado), cita
  verificada por el investigador: https://www.elpais.com.uy/negocios/gobierno-anuncio-aumento-de-combustibles-del-12
- 2021-07-31, `en_contra` (nafta +7,6%, gasoil ~11%): ídem, verificado también por mí en esta
  sesión: https://www.elpais.com.uy/negocios/noticias/el-gobierno-subio-7-6-las-naftas-y-casi-11-el-gasoil-y-desperto-cuestionamientos-a-nuevo-esquema
  — cita: "A partir de las 00 de hoy comenzaron a regir los aumentos en las tarifas de nafta y
  gasoil anunciados en la conferencia realizada en Torre Ejecutiva, el día de ayer."
- 2021-06-30, `en_contra` (segundo aumento consecutivo; no estaba en ningún `promesas.yaml` de este
  lote): verificado por mí en esta sesión:
  https://www.elpais.com.uy/informacion/politica/paganini-y-arbeleche-estan-estudiando-que-se-puede-hacer-con-precios-de-combustibles-dijo-lacalle-pou
  — cita: "El último ajuste en el precio del combustible comenzó a regir el 30 de junio, lo que
  significa un incremento en las tarifas por segundo mes consecutivo, luego de haber postergado el
  ajuste durante dos meses a pedido del presidente de la República, Luis Lacalle Pou."
- 2022-03-30, `en_contra` (nafta +$3, gasoil +$5, con la brecha respecto del PPI): es la
  declaración T2 declaraciones[2] de este mismo lote (arriba), con cita ya verificada.
- 2024-02-29, `en_contra` (nafta y gasoil +$1/L, supergás +$4/kg, por debajo del PPI): verificado
  por mí en esta sesión: https://www.elpais.com.uy/negocios/noticias/a-partir-de-este-viernes-aumenta-la-nafta-el-gasoil-y-el-supergas-de-cuanto-es-la-suba-definida
  — cita: "El gobierno definió un aumento del precio de los principales combustibles, según
  informó la ministra de Industria, Energía y Minería Elisa Facio. La nafta y el gasoil subirán $ 1
  por litro, mientras el supergás incrementará su precio en $ 4 por kilo." Sin cita de Lacalle Pou
  (solo de la ministra Facio); también hay decreto del propio Lacalle Pou (43/024, 30/01/2024,
  IMPO) sobre el componente financiero del margen de distribución, según `2026-09-05-t3/notas.md`,
  no reverificado por mí.
- 2024-11-29, 2025-01-30 y 2025-02-28 (mixto/`a_favor`/`en_contra` según el mes): documentados con
  URLs de Presidencia y El País en `2026-09-05-t3/notas.md`, sección `hipotesis`; no los reverifiqué
  con `pnpm fuente` en esta sesión, quien arme la corrección debe reabrirlos.
- `a_favor`: 2021-04-12 y 2021-05-07 (ya en el `promesas.yaml` vaciado del tramo 1, citas
  verificadas por el investigador); serie 2024-11-29/2025-02-28 arriba.
- Corregir además, al reconstruir la evidencia de 2021-04-12: la `descripcion` decía "30,8%"
  atribuido a El País, que en realidad dice "30%" (el 30,8% es de Montevideo Portal, sobre el
  primer trimestre, no sobre diciembre-marzo). Objeción `corregir` T1 declaraciones[1].

## segunda_fuente_para_registro_existente (para la corrección posterior, no promovido en este lote)

Verificado por el crítico (`critica.md`, objeción de lote 7) abriendo las 8 notas; no reabrí estas
URLs yo mismo por no ir a ningún registro de este lote. Sirven 5:

- `2021-07-20-bajo-petroleo-mensaje-ministros` + https://www.elpais.com.uy/informacion/politica/paganini-y-arbeleche-estan-estudiando-que-se-puede-hacer-con-precios-de-combustibles-dijo-lacalle-pou (sumaría primer alineamiento `oficialista_tradicional`; cita ya releída por mí en esta sesión, ver arriba).
- `2022-01-25-mecanismo-luc-espalda-ancap` + https://www.elpais.com.uy/negocios/noticias/gobierno-cree-que-hay-espalda-todavia-para-evitar-ajuste-de-los-combustibles
- `2022-03-27-mecanismo-transparencia-no-paga-sobrecosto` + https://www.elpais.com.uy/informacion/politica/lacalle-dijo-que-el-referendum-es-una-etapa-superada-y-la-luc-queda-firme (mueve de `probable` a dos alineamientos).
- `2022-05-28-espalda-ancap-termino` + https://www.elpais.com.uy/informacion/politica/ajuste-en-precio-de-combustibles-se-termino-la-espalda-de-ancap-dijo-lacalle-pou — con salvedad: fijar antes si el acto de Juan Lacaze fue el 27 o el 28/05/2022 (Presidencia dice "sábado 28"; El País dice "ayer" con sello del 28); esa misma página de Presidencia enlaza audio que resolvería la fecha y subiría el registro a `textual`.
- `2022-08-25-esperemos-poder-bajar-combustibles` + https://www.elpais.com.uy/informacion/politica/esperemos-poder-bajar-por-lo-menos-algunos-combustibles-dijo-lacalle-pou

No sirven (verificado por el crítico, cita en boca de otra persona o nota sin resultado):
`2020-03-11-combustibles-no-suben-adecuacion-menor` (cita es de Delgado, no de Lacalle Pou);
`2021-11-16-deberiamos-haber-aumentado-ganancia-ancap` (sin nota de El País localizada);
`2023-01-31-ancap-soporta-no-hacer-suba` (las dos notas de El País citan a Paganini, no a Lacalle
Pou; el crítico señala que la segunda fuente real de ese registro sería Subrayado, no El País).

## Pendientes que no aborda este lote (fuera de mi alcance)

- Cobertura pre-2020 (campaña 2019, oposición/senador): ningún tramo la confirma como cubierta por
  la corrida anterior ni la declara fuera de alcance. No abrí `inbox/lacalle-pou/economia/combustibles/2026-09-04/`
  para verificarlo: no es parte de mi encargo y sería releer otra corrida.
- Huecos de cobertura 2020-04/2021-03, buena parte de 2022-2023 y 2025-03 en adelante: son
  hallazgos investigativos (objeción de lote 5), no algo que un editor deba resolver reabriendo
  fuentes nuevas.
- Balance de alineamiento (falta `progresista` e `independiente` en el tema): objeción de lote 8,
  requiere barrido nuevo, no edición.

## Validación

Corrí `pnpm validar --inbox <dir> --red` sobre las tres carpetas después de todos los cambios
anteriores; ver resultado en el informe final.
