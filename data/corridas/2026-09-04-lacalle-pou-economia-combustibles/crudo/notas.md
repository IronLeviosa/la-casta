## candidatos_giro

- **Antes:** 2019-03-30, campaña ("Si gana el Partido Nacional se terminó el aumento de impuestos, las tarifas y los
  combustibles. Se terminó.", `declaraciones.yaml`) **vs. Después:** 2022-05-28, gobierno ("La espalda
  básicamente se terminó", anticipando un ajuste al alza de combustibles, `declaraciones.yaml`). Parece un giro
  del "no va a haber más aumentos" de campaña a "hay que subir porque ANCAP no aguanta más" en gobierno. Con la
  cita extendida de 2021-11-16 ("y deberíamos de haber aumentado, pero como ANCAP dio ganancia... dijimos vamos a
  no cobrarle a la gente") y la declaración del 03-03-2022 (reconoce el incumplimiento por pandemia y guerra en
  Ucrania, "obviamente no hubiera hecho ese compromiso"), el cuadro se matiza: no es un giro discursivo repentino
  en mayo de 2022, sino la continuación de un criterio -pagar con ganancias de ANCAP cuando las hay, subir cuando
  no- que él mismo venía explicitando desde 2021. Falta: confirmar con un decreto o nota oficial cuánto subió
  efectivamente el precio en junio de 2022 y compararlo con la brecha de PPI que él mismo citaba, para saber si
  el traslado fue total o parcial.

- **Antes:** 2019-03-30, campaña (promesa general de no aumentar "impuestos, tarifas y combustibles") **vs.
  Después:** 2020-03-11, gobierno (anuncio de suba de tarifas de UTE/OSE/Antel "para cumplir con compromisos
  electorales", según la cita de Montevideo Portal, mientras los combustibles sí se mantuvieron sin cambios).
  Tensión discursiva entre la promesa amplia y su cumplimiento parcial (se cumplió para combustibles, no para el
  resto de las tarifas). Falta: precisar a qué "compromiso electoral" se refería exactamente Lacalle Pou en esa
  cita (¿ahorro fiscal general, distinto del "no aumento de tarifas"?); no quedó claro con las fuentes leídas.

- **Antes:** 2022-01-25 y 2022-03-27, gobierno (defiende el mecanismo del PPI como "medida de transparencia" y
  dice que no se va a cambiar) **vs.** 2022-03-03, entrevista (en la misma ventana de la campaña del referéndum,
  admite que "es cierto" que no pudo cumplir la promesa de no subir combustibles, y lo atribuye a la pandemia y a
  la guerra en Ucrania). No es exactamente un giro -son dos preguntas distintas (¿el mecanismo es bueno? ¿cumplió
  la promesa?) respondidas de forma coherente entre sí (el mecanismo es el que explica por qué no cumplió)-, pero
  el editor debería tenerlas juntas: la defensa del mecanismo y el reconocimiento del incumplimiento conviven en
  la misma semana de campaña.

## hipotesis

- Existe una contradicción aparente entre dos fuentes sobre el mismo evento (11-03-2020): Montevideo Portal
  afirma explícitamente "no subirán las de Ancap", mientras que El Observador (12-03-2020) describe "la suba de
  los precios en UTE, OSE, Ancap y Antel" como "la primera y gran polémica de la transición". No se resolvió la
  discrepancia por falta de una tercera fuente o del decreto oficial de tarifas de esa fecha; puede que El
  Observador se refiera a la polémica por la posibilidad de la suba (no a un aumento efectivo), ya que la propia
  nota de El Observador ubica el reclamo en diciembre de 2019, antes de que asumiera el gobierno. Queda para una
  próxima corrida revisar el decreto de tarifas de marzo de 2020.
- En las declaraciones de 2025 sobre la polémica de ANCAP, Lacalle Pou critica implícitamente al gobierno actual,
  pero ninguna cita literal suya nombra a "Orsi"; son los medios quienes lo mencionan en su propio texto
  periodístico. Por eso no se generó un registro en `menciones.yaml` (la regla exige que la cita literal
  contenga la mención).
- LARED21 (lr21.com.uy) tenía cobertura relevante tanto de la promesa de 2019 como del episodio "la espalda de
  Ancap" de 2022, pero la URL devolvió HTTP 403 con `pnpm fuente`; no se pudo verificar el texto literal.
- No se encontró declaración textual (video, documento oficial o diario de sesiones) de Lacalle Pou en primera
  persona sobre combustibles en esta corrida; toda la evidencia de declaraciones quedó en nivel `reportado`. Sí
  se incorporó un documento oficial (ley 19.889, IMPO) para la evidencia de la promesa de liberalización de la
  importación, que sube esa evidencia puntual a nivel `textual`. El único video encontrado con título
  prometedor ("Conferencia de prensa ante el incremento de los combustibles") resultó, tras transcribirlo, ser
  una conferencia del gobierno de Guatemala (presidente Bernardo Arévalo), sin relación con Uruguay ni con
  Lacalle Pou; se descartó por completo.
- No se relevaron declaraciones textuales atribuidas directamente a Lacalle Pou para 2024 y 2026 sobre
  combustibles (sí hay decretos de ajuste de precios firmados por él como presidente, pero sin cita directa
  encontrada en esta corrida). Un artículo de Ámbito (30-09-2024) menciona en un enlace relacionado un titular
  -"Luis Lacalle Pou defendió la fijación del precio de los combustibles: 'Cuando sube, sube, y cuando baja,
  baja'"- que no se pudo localizar como URL propia ni con `pnpm fuente` ni con búsqueda web; si existe, sería una
  declaración de 2024 defendiendo el mecanismo con un ejemplo de baja. Pendiente para una próxima corrida.
- El artículo de Ámbito sobre la baja de combustibles de octubre de 2024 no tiene declaración propia de Lacalle
  Pou (es un parte de prensa del MIEM); se dejó fuera del lote por no tener cita suya, aunque documenta una baja
  real de precios durante su mandato.

## casos_vistos

(sin casos judiciales relevantes encontrados en esta corrida sobre el tema combustibles; no se investigó ninguno
por regla).

## verificacion_manual

- https://www.lr21.com.uy/politica/1438444-lacalle-pou-aumento-impuests-peajes-tarifas-2019 — `pnpm fuente`
  devolvió `HTTP 403`.
- https://www.presidencia.gub.uy/comunicacion/comunicacionnoticias/se-mantiene-precio-combustibles — la URL ya
  no aloja el contenido histórico esperado (según el snippet del buscador, una nota sobre que Ancap mantiene
  precios); `pnpm fuente` devolvió la portada actual de Presidencia bajo el gobierno de Orsi. No se pudo
  verificar el texto original de esa nota; no se usó como fuente de ningún registro.
- https://administrador.m24.com.uy/nueva-suba-de-combustibles-naftas-acumulan-incremento-de-41-gasoil-de-47-y-supergas-de-63/
  — `pnpm fuente` devolvió `fetch failed`. Contenía, según el snippet del buscador, una cita de Lacalle Pou
  reconociendo el incumplimiento de la promesa por la pandemia y la guerra en Ucrania; se encontró la misma
  declaración, ya verificada con `pnpm fuente`, en El Observador (05-03-2022) y Teledoce (03-03-2022), que se
  usaron en su lugar.

## cobertura_del_periodo

- Campaña 2019: cubierta (declaraciones del 30-03-2019 y el 04-09-2019).
- Gobierno 2020: cubierta (11-03-2020, primer ajuste tarifario, con cita extendida; además evidencia sobre el
  proyecto de LUC de enero, el retiro del artículo de desmonopolización en mayo -documentado ahora con el texto
  de la ley 19.889 en IMPO- y el resultado parlamentario de octubre en el Presupuesto, con la atribución
  partidaria corregida).
- Gobierno 2021: cubierta y ampliada (20-07-2021, "Bajó el petróleo"/voluntad de transparentar el sistema;
  16-11-2021, acto en Dolores, con la cita extendida que incluye "deberíamos de haber aumentado").
- Gobierno 2022: cubierta y ampliada. Además de "la espalda de Ancap se terminó" (28-05-2022) y la decisión de
  no subir en febrero de 2023, se agregaron cuatro declaraciones del período de la campaña del referéndum contra
  la LUC (25-01-2022, defensa del mecanismo como "medida de transparencia"; 03-03-2022, reconocimiento del
  incumplimiento de la promesa por pandemia y guerra en Ucrania; 27-03-2022, defensa del mecanismo la noche del
  triunfo del "No"; 25-08-2022, expectativa de baja de precios para setiembre) que en la corrida anterior no
  estaban, y que corrigen la asimetría señalada por la crítica (solo había citas de suba/no innovar, ninguna de
  baja ni de defensa explícita del mecanismo en ese período).
- Gobierno 2023: cubierta y ampliada (31-01-2023, mantener precios en febrero; 01-06-2023, baja efectiva de
  precios tras cuatro meses de congelamiento, sin cita directa de Lacalle Pou pero incorporada como evidencia de
  la promesa).
- Gobierno 2024: no se encontró en esta corrida ninguna declaración textual directa de Lacalle Pou sobre
  combustibles; solo se hallaron notas sobre decretos de ajuste de precios y un posible titular de Ámbito sobre
  una defensa del mecanismo en setiembre de 2024 que no se pudo localizar (ver `hipotesis`). Pendiente de una
  próxima corrida.
- Posmandato/entrevista 2025: cubierta (07-05-2025, primera entrevista como expresidente, sobre la controversia
  con la gestión de ANCAP del nuevo gobierno).
- 2026 (hasta la fecha del brief, 04-09-2026): no se encontraron declaraciones nuevas de Lacalle Pou sobre
  combustibles en esta corrida.
- No se identificó un contexto de "oposición" o "parlamento" propiamente dicho sobre este tema: Lacalle Pou fue
  presidente durante todo el período en que el tema estuvo activo en la agenda pública (2020-2025) y, tras dejar
  la Presidencia, renunció a la banca de senador que había ganado, por lo que no ejerció un rol legislativo
  activo en el posmandato cubierto por esta corrida.
- Correcciones de esta corrida (pedidas por el crítico): (1) se agregaron declaraciones sobre bajas de precios
  efectivas o esperadas (20-07-2021, 25-08-2022, evidencia de promesa del 01-06-2023); (2) se agregaron
  declaraciones defendiendo el mecanismo del PPI durante la campaña del referéndum de la LUC (25-01-2022,
  03-03-2022, 27-03-2022); (3) se corrigió `promesas[1].evidencias_candidatas`: se agregó el hecho de que el
  artículo de desmonopolización fue retirado de la LUC antes de votarse (mayo de 2020, documentado con la ley
  19.889 en IMPO) y se corrigió la descripción del hecho de octubre de 2020 para atribuirlo al Presupuesto -no a
  la LUC- y a la oposición de Batllistas -no de Cabildo Abierto- según lo que realmente documenta esa fuente;
  (4) se extendió la cita de `declaraciones` del 16-11-2021 para incluir "y deberíamos de haber aumentado"; (5)
  se corrigió el `resumen` de la declaración del 11-03-2020 para reflejar que anunció una futura "adecuación" de
  precio sin adelantar su magnitud, se extendió su cita, y se sacó a El Observador como segunda fuente (su cita
  original era sobre las tarifas de UTE/OSE/Antel, no sobre combustibles), quedando `_faltante: segunda_fuente`.

## objeciones_al_brief

Ninguna. Tanto el brief original como el pedido de corrección del crítico piden expresamente cobertura simétrica
del período completo (campaña, gobierno, oposición y posmandato, tanto declaraciones de suba/no innovar como de
baja/defensa del mecanismo) y no piden omitir ni encuadrar nada a favor o en contra de ningún partido o persona.
No se detectó ningún pedido asimétrico que ameritara aplicar la Regla 0.

## medios_faltantes

- `infobae` (infobae.com) — usado como única fuente reportada para la declaración y la evidencia del 31-01-2023;
  no está en la tabla de medios del brief. Grupo editorial no verificado en esta corrida.
- `ambito.com` (Grupo América / Uruguay) — usado como fuente adicional (tercera) de la declaración del
  07-05-2025 y como única fuente de la evidencia de la baja de precios de junio de 2023; no está en la tabla de
  medios del brief. Grupo editorial no verificado en esta corrida.
- `teledoce.com` (Telemundo, Canal 12) — usado como segunda fuente en dos declaraciones nuevas (20-07-2021 y
  03-03-2022). Sí está dado de alta en `content/medios/teledoce.yaml` (grupo `cardoso`), por lo que no genera
  faltante, pero se deja constancia porque no se había usado en la corrida anterior de este lote.
- `caras-y-caretas` — usado como fuente de la declaración del 25-01-2022. Está dado de alta en
  `content/medios/caras-y-caretas.yaml`.
- `lr21.com.uy` (LARED21) — apareció en varias búsquedas con contenido relevante pero no se pudo leer (ver
  `verificacion_manual`); si en el futuro se logra acceder, convendría darlo de alta también.
