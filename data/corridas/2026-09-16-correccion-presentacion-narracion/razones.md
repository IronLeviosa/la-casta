# Razones de edición — 2026-09-16-correccion-presentacion-narracion

## Cambios de forma

- chequeos[0] (barandiaran/1997-12-11-caja-militar-costaba-aproximadamente-us-230): analisis reemplaza «no se pudo abrir por esta vía» por el límite de evidencia (Ley 16.878 sin articulado publicado en IMPO); dato_real reemplaza «por esa vía» por «con ese documento». Mismos hechos y fuentes, sin narrar el proceso.

## Cambios de forma

- chequeos[1] (barandiaran/1997-11-25-deficit-conjunto-cajas-militar-policial-alcanzaba): dato_real reemplaza «por esa vía» por «con ese documento», mismo caso que chequeos[0] (Ley 16.878 sin articulado en IMPO). Resto del párrafo sin tocar.

## Cambios de forma

- chequeos[2] (batlle/2005-11-28-rebaja-15-millones-bancos): dato_real y analisis reemplazan «en esta sesión»/«Esta sesión no encontró/no pudo confirmar» por «no hay un documento publicado que desglose…». Tier probable sin tocar.

## Cambios de forma

- chequeos[3] (batlle/2005-11-28-rebaja-40-millones-50-empresas): dato_real y analisis reemplazan «en esta sesión»/«esta sesión no pudo confirmar» por «la exposición de motivos no está publicada con ese desglose». Mismo criterio que chequeos[2]. Tier probable sin tocar.

## Cambios de forma

- discrepancias[0] (la-republica/2018-03-29-ute-obtuvo-ganancia-neta-492-millones): analisis reemplaza «no pude cotejarlo» por «no se puede cotejar» (el informe de la consultora no está publicado). No se tocan «no la registro»/«no tengo el documento primario»: fuera del alcance de este barrido (script no las detectó); quedan anotadas para una revisión simétrica futura.

## Cambios de forma

- discrepancias[1] (caras-y-caretas/2022-06-26-monopolio-antel-transmision-datos-es-ley-2): analisis reemplaza «Busqué la cadena paquete…» por «La cadena paquete no aparece ninguna vez…», mismo hallazgo (147.274 caracteres del texto de IMPO). No se toca «Registro qué publicó el medio…» final: no nombra el proceso ni la primera persona en el sentido que el barrido cubre.

## Cambios de forma

- vetos[0] (batlle/2001-01-10-ley-presupuesto-nacional-2000-2004): analisis. Se decidió que las dos apariciones de en esta sesion referian a la sesion parlamentaria: la primera ya estaba precisada (la Asamblea General, en su primera sesion de considerarlas); la segunda (para los 13 restantes) se preciso con fecha y camara, sesion de la Asamblea General del 14 de febrero de 2001, dato que ya constaba en resultado.fecha y en el titulo de la fuente del propio registro, sin abrir la fuente de nuevo. Las dos apariciones de en esta investigacion se reemplazaron por el limite de evidencia sin nombrar el proceso (el desenlace documentado cubre 6 de los 19; no hay una declaracion publica de Batlle). No se toco resultado.detalle, que tiene la misma frase en esta investigacion: queda fuera del alcance de este barrido (el script no escaneo ese campo) y anotada para una revision simetrica futura en todo content/.

## Cambios de forma

- medios[0] (elpueblodigital): propiedad.descripcion reemplaza la nota citada en este lote por la nota consultada. Resto del texto (busqueda sin fuente sobre fundacion/propiedad) sin tocar: describe una limitacion de la fuente, no el proceso editorial.

## Cambios de forma

- analisis[0] (antel/2012-05-19-leon-renta-monopolica-2012): afirmaciones[0].dato_real.valor reemplaza No se pudo leer el balance de 2011 en si por El balance de 2011 es un PDF escaneado sin capa de texto legible, asi que no permite comprobar si... (caso limite, mismo hecho sin narrar el intento de lectura); ademas se partio en dos parrafos por limite de oracion (112 palabras en uno, ahora 79+30 tras la reescritura), sin cambiar ninguna otra palabra. afirmaciones[2].dato_real.valor solo se partio en dos parrafos por limite de oracion (89 palabras -> 42+47), sin narracion de proceso ni cambio de palabras.

## Cambios de forma

- Cierre: pnpm validar --inbox --red --breve corrio dos veces con 0 errores; los 5 avisos del lote son los previstos por el brief (chequeos[2] y [3], grupo unico, tier probable, no se tocan) o preexistentes y ajenos a esta correccion (URL 404 de la fuente primaria de vetos[0], ya documentada en notas_internas del propio registro como pendiente del resolvedor).

## Corrector

- vetos[0] (batlle/2001-01-10-ley-presupuesto-nacional-2000-2004, resultado.detalle): reemplacé «su desenlace individual no quedó documentado en esta investigación» por «no quedó establecido», igual que ya decía el campo analisis del mismo registro; sin cambio de hecho ni de tier.

## Corrector

- discrepancias[0] (la-republica/2018-03-29-ute-obtuvo-ganancia-neta-492-millones, analisis): quité la primera persona de «pero no la registro porque…no tengo el documento primario que decida», reescrito como «pero queda sin registrar aquí…sin documento primario legible que permita decidirla»; mismo sentido, sin cambiar la cifra ni el nivel de evidencia.
