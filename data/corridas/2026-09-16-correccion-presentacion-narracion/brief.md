# Brief: corrección 2026-09-16-correccion-presentacion-narracion

Tipo: presentacion. Carpeta: inbox/correcciones/presentacion-narracion-2026-09-16. Origen: barrido simétrico de narración de proceso en texto para el lector, sobre todo content/, para todas las personas, medios y empresas por igual (2026-09-16).

Cómo se hizo el barrido: un script recorrió todos los YAML de content/ y buscó, en los campos resumen, analisis, texto, motivo, dato_real, para_el_lector (y en una segunda pasada también titulo y descripcion), sin mirar cita ni fuentes, estos términos: «esta sesión», «en esta corrida», «el editor», «el crítico», «vuelta», «notas.md», «inbox», «.yaml», «en esta investigación», «no se pudo abrir», «no pude»; y en la segunda pasada «esta búsqueda», «dentro del tiempo», «por esta vía», «no se localizó», «en este lote», «esta pasada», «el investigador», «el resolvedor», «el validador», «no se verificó en», «no se pudo verificar», «no se pudo leer», «no se pudo confirmar», «no logré», «no encontré», «busqué».

Criterio, igual para todos:
- Se reescribe el texto que habla del proceso de producción: la sesión, la corrida, el lote, la investigación, los roles (editor, crítico, investigador), los archivos o herramientas, o la primera persona («no pude», «busqué»). Se reescribe diciendo el límite de la evidencia sin el proceso («no consta en…», «el documento no está publicado en…», «no hay una votación nominal separada en el diario de sesiones de esa fecha»).
- No se toca el texto que dice un límite de la evidencia sin nombrar el proceso («No se localizó la Memoria Anual 2000 del BCU»): es información para el lector.
- No se toca «esta sesión» cuando es una sesión parlamentaria citada: se deja o se precisa con la fecha y la cámara.
- Falsos positivos descartados en el barrido: «primera vuelta» y «segunda vuelta» electorales (eventos/elecciones-2014, 2019, 2024; eventos/incidente-diplomatico-hierro-lopez-2023; leyes/19-827), «se da vuelta» en chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil, y las frases «no se localizó / no se pudo confirmar / no se pudo verificar» que no nombran el proceso (en analisis/ancap, analisis/brou, analisis/correo, analisis/ose, chequeos de astori, barandiaran, batlle y lacalle-pou, discrepancias/montevideo-portal, empresas/antel, empresas/ute).

Registros con narración de proceso (nueve, copiados de content/ con _id):
- chequeos/barandiaran/1997-12-11-caja-militar-costaba-aproximadamente-us-230: analisis «no se pudo abrir por esta vía»; dato_real «por esa vía».
- chequeos/barandiaran/1997-11-25-deficit-conjunto-cajas-militar-policial-alcanzaba: dato_real «por esa vía».
- chequeos/batlle/2005-11-28-rebaja-15-millones-bancos: dato_real y analisis «en esta sesión» / «Esta sesión no encontró».
- chequeos/batlle/2005-11-28-rebaja-40-millones-50-empresas: dato_real y analisis «en esta sesión» / «esta sesión no pudo confirmar».
- discrepancias/la-republica/2018-03-29-ute-obtuvo-ganancia-neta-492-millones: analisis «no pude cotejarlo».
- discrepancias/caras-y-caretas/2022-06-26-monopolio-antel-transmision-datos-es-ley-2: analisis «Busqué la cadena…».
- vetos/batlle/2001-01-10-ley-presupuesto-nacional-2000-2004: analisis «en esta sesión» (decidir si es la sesión parlamentaria o el proceso) y «en esta investigación» (dos veces).
- medios/elpueblodigital: propiedad.descripcion «la nota citada en este lote».
- analisis/antel/2012-05-19-leon-renta-monopolica-2012: dato_real «No se pudo leer el balance de 2011 en sí (es un PDF escaneado…)», caso límite; además dos párrafos de dato_real pasan de 80 palabras (112 y 89) y el validador del inbox los rechaza.

Fuera de este lote: chequeos/batlle/2000-11-21-iva-tasas-0-14-23-noviembre-2000 y chequeos/batlle/2002-05-30-ley-iva-frutas-verduras-junio-2002 también dicen «esta sesión», pero están en la corrección 2026-09-16-correccion-batlle-lectura-chequeos-2000-2002, que las reescribe; se verifican al final. Los motivo de content/correcciones/ (32 registros) quedan a la espera de una decisión aparte.

No cambia afirmaciones, cifras, calificaciones, tiers, fuentes ni ids.
