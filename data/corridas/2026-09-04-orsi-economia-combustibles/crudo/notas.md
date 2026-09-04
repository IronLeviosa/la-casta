## candidatos_giro

Ninguno con un par de registros completo (antes/después, ambos con cita literal). Ver `hipotesis` para el candidato más fuerte, que quedó incompleto por falta de la cita "antes".

## hipotesis

- **Posible giro sobre impuestos a los combustibles.** El 2026-05-01 Orsi, ya de presidente, calificó de "muy aventurado" resignar impuestos que integran el precio del combustible (declaraciones.yaml, registro 4). El mismo artículo de El Observador dice, de pasada, que esa reducción de impuestos "en un momento sugirió el Frente Amplio siendo oposición". No encontré, ni en el corpus ni en la web con el tiempo disponible, la cita literal de esa propuesta opositora (2020-2024) de Orsi o del FA sobre bajar IMESI/IVA a los combustibles. Sin esa cita "antes" no puedo armar el par para `candidatos_giro`. Falta: ubicar el comunicado, moción parlamentaria o declaración de esa época con cita textual.
- **Metodología PPI: intención de espaciar el ajuste y reversión a los cinco días.** En abril de 2025 el gobierno anunció la intención de pasar de un ajuste mensual a uno de entre dos y seis meses (ambito, 2025-04-01, "¿Puede una Ancap con pérdidas absorber un ajuste más espaciado de los combustibles?"), y el 2025-04-30 (cinco días después de la conferencia de prensa citada en declaraciones.yaml) volvió a un ajuste mensual (ambito, "El gobierno definió un nuevo ajuste mensual tras la polémica..."). No incluí esto como declaración porque en ninguna de las dos notas hay una cita textual de Orsi mismo sobre el cambio de criterio: quienes hablan ahí son la ministra Cardona y el secretario de Presidencia Alejandro Sánchez. Queda como hipótesis de una corrección rápida de rumbo, no como giro discursivo de Orsi.
- **Sobreprecio de US$ 90 millones (marzo-diciembre 2025) que denuncia el Partido Nacional.** Solo lo encontré en ambito.com (grupo-ambito), citando un informe del Centro de Estudio de Políticas Públicas de diciembre de 2025 ("Barómetro Energético"). No hallé una segunda fuente de otro grupo de medios que lo reprodujera con cifras propias (hay una nota de La Mañana, que no está en la tabla de medios del brief). Quedó incluido en `promesas.yaml` como evidencia candidata con `_faltante: segunda_fuente`.

## casos_vistos

- https://www.youtube.com/watch?v=1Le_HmMv2OM — Conferencia de prensa de Orsi (2025-10-23) donde anuncia la rescisión del contrato con el astillero español Cardama por las patrulleras oceánicas y adelanta denuncia penal y civil por indicios de estafa al Estado. No es del tema combustibles (lo abrí por una búsqueda de "conferencia de prensa Orsi Ancap" que devolvió este video por error); no lo investigué más allá de leer el resumen.

## verificacion_manual

Ninguna. Todas las URLs citadas se leyeron con éxito vía `pnpm fuente` en esta sesión (dos de ellas — el-observador `delgado-le-respondio-orsi...` e infobae `uruguay-resalta-no-haber-trasladado-75-millones...` — tuvieron fallos al guardar en Wayback, pero el texto se extrajo sin problema; no son fuentes no verificables).

## cobertura_del_periodo

- **Campaña (2024):** cubierto por un único episodio identificado, el cruce Orsi-Lacalle Pou-Delgado del 13-14 de setiembre de 2024 en X, donde Orsi acusa al gobierno saliente de no cumplir su promesa de "no tocar" los combustibles. No encontré declaraciones de Orsi sobre combustibles en debates presidenciales, entrevistas de campaña o el programa de gobierno del Frente Amplio con cita textual (sí hay caracterizaciones de prensa sobre el plan de espaciar los ajustes de precio, pero sin cita literal de Orsi).
- **Balotaje (noviembre de 2024):** sin resultados en el corpus ni en la web sobre combustibles específicamente en esta ventana.
- **Transición (noviembre 2024 - febrero 2025):** sin declaraciones textuales de Orsi localizadas; hay caracterizaciones de prensa (ambito) sobre la intención del entrante gobierno de modificar el esquema de ajuste, pero atribuidas de forma genérica al "Frente Amplio", no a Orsi con cita directa.
- **Gobierno (marzo 2025 - hoy):** es el tramo mejor cubierto, con cinco declaraciones que van del 2025-04-25 (primera conferencia de prensa sobre el estado de Ancap, con video oficial) al 2026-05-26 (indicios de aumento por la guerra en Medio Oriente), más contexto de acciones de gobierno hasta el 2026-09-01 (congelamiento de precios en setiembre, la nota más reciente encontrada, a tres días de la fecha de esta corrida).
- **Oposición:** no aplica — en el período que cubre este brief (desde la campaña 2024), Orsi no ejerció como legislador opositor; antes de ser candidato presidencial fue intendente de Canelones (2015-2024), período fuera del alcance que fija el brief ("desde la campaña previa al primer mandato").
- **Posmandato:** no aplica — Orsi está en_cargo.
- La diferencia de volumen respecto a un mandato completo (por ejemplo, el de Lacalle Pou) es esperable: el mandato de Orsi lleva 18 meses cubiertos en este brief contra los 5 años de Lacalle Pou, y la mayoría del material de campaña 2024 sobre combustibles pertenece al gobierno saliente (Lacalle Pou/Delgado) respondiendo a Orsi, no a declaraciones propias de Orsi sobre el tema.

## objeciones_al_brief

Ninguna. El brief pide cobertura simétrica del período completo (campaña, gobierno, oposición, posmandato) y explícitamente exige registrar también lo consistente (`sin_cambio`), sin pedir selección por partido o encuadre favorable/desfavorable. No encontré ninguna instrucción asimétrica que objetar.

## medios_faltantes

Ninguno. Todos los medios citados (el-observador, la-diaria, montevideo-portal, ambito, subrayado, caras-y-caretas, infobae, youtube) ya están en `content/medios/` según la tabla del brief.
