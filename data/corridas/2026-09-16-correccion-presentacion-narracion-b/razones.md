# Razones de edición — 2026-09-16-correccion-presentacion-narracion-b

## Cambios de forma

- analisis[0] (analisis/alur/2016-02-01-rossa-sobrecosto-biocombustibles-2012-2014, metodo): «en el pasaje consultado en esta corrida» pasa a «en el pasaje que trata estos tres montos», el límite de qué parte del informe no describe metodología, sin nombrar la corrida.

## Cambios de forma

- analisis[1] (analisis/ancap/2022-03-03-ced-sobreprecio-combustibles-paridad, graficos[1].metodo): «el archivo oficial disponible en esta corrida» pasa a «el archivo oficial de URSEA con el que se construyó esta serie», procedencia por el documento de origen.

## Cambios de forma

- chequeos[0] (chequeos/lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil, grafico.metodo): «el crudo de la corrida 2026-09-07-lacalle-pou-brasil-serie (archivo _series.yaml)» pasa a nombrar los documentos de origen (precios de URSEA y ANP, tipos de cambio del BCU y el BCB serie 3695) en vez del id de la corrida y el nombre del archivo.

## Cambios de forma

- chequeos[0] (mismo registro, graficos[0].metodo): «que pudo reconstruirse en esta corrida» pasa a «que registran esos decretos y datasets», el límite proviene del propio documento oficial, no del proceso de reconstrucción.

## Cambios de forma

- empresas[0] (empresas/antel, monopolio.argumentos_en_contra[2].quien): «no se pudo ubicar y abrir en esta sesión» pasa a «no está disponible en línea para cotejar la cita directamente».

## Cambios de forma

- medios[0] (medios/augpee, alineamiento.justificacion): «sin alineamiento documentado en este lote» pasa a «sin alineamiento documentado».

## Cambios de forma

- medios[1] (medios/foco-economico, alineamiento.justificacion): «No encontré una fuente…» (primera persona) pasa a «No hay una fuente…».

## Cambios de forma

- medios[2] (medios/pv-magazine-latam, alineamiento.justificacion): «sin alineamiento documentado en este lote» pasa a «sin alineamiento documentado».

## Cambios de forma

- politicos[0] (politicos/silva-robert, alias_ambiguos[0].nota): «no se verificaron individualmente en esta corrida» pasa a «quedan sin el id de legislador confirmado individualmente».

## Cambios de forma

- promesas[0] (promesas/lacalle-pou/no-aumentar-impuestos, fundamentacion): «que no está en este lote» pasa a «que no queda documentado en este registro».

## Cambios de forma

- promesas[1] (promesas/orsi/limitar-designaciones-directas-estado, fundamentacion): «No hay, en este lote, una fuente…» pasa a «No hay una fuente…».

## Corrector

- analisis[0] (alur/2016-02-01-rossa-sobrecosto-biocombustibles-2012-2014): metodo decía "que esta corrida no leyó por separado del cuerpo principal"; queda "que no se consultó por separado del cuerpo principal", el mismo límite sin nombrar la corrida.

## Corrector

- chequeos[0] (lacalle-pou/2022-03-27-combustibles-mas-baratos-brasil): grafico.metodo atribuía a esta investigación el cambio de metodología de la ANP de 2004; queda como cambio de metodología de la ANP, no de este cálculo. graficos[0].metodo remitía al crudo de la corrida 2026-09-07-lacalle-pou-brasil-serie; se retira esa oración, el resto del párrafo ya da el emparejamiento y su fuente.

## Corrector

- medios[2] (pv-magazine-latam): propiedad.descripcion decía "la nota de este lote lleva aviso de copyright propio"; queda "la página lleva aviso de copyright propio", sin nombrar el lote.

## Corrector

- promesas[1] (orsi/limitar-designaciones-directas-estado): fundamentacion decía "que ninguna fuente de este lote resuelve"; queda "que ninguna fuente disponible resuelve", sin nombrar el lote.

## Corrector

- Releídos con el mismo criterio y sin cambios: analisis[1] (ancap/2022-03-03-ced-sobreprecio-combustibles-paridad), empresas[0] (antel: que_hace, resumen, monopolio, hitos), medios[0] (augpee), medios[1] (foco-economico), politicos[0] (silva-robert) y promesas[0] (lacalle-pou/no-aumentar-impuestos). Se dejaron sin tocar los usos de "esta ficha"/"este registro" que describen un límite de la evidencia sin nombrar corrida, lote, sesión ni rol (mismo criterio que ya tenía lo publicado en estos y otros registros del sitio); no se revisó exhaustivamente finanzas[] de empresas/antel (28 años, cifras y citas cortas, no prosa narrativa) por su tamaño.

## Corrector

- correcciones[0]: se agregaron cambios[11..15] (los cinco fixes de arriba) y se reescribió motivo para sumar la tercera pasada; afecta no cambió. pnpm lote comparar detectó una diferencia numérica en chequeos[0] (metodo), heredada de la edición del paso 1: al reemplazar la referencia a la corrida, esa edición mencionó dos veces la serie 3695 del BCB y retiró el número de la corrida; mi propio retiro de la misma referencia en graficos[0].metodo suma esa diferencia. No es cambio de cifra ni de fuente, es el número de un id de corrida que la corrección debía retirar; no se tocó, queda para que el orquestador lo confirme.

## Promoción (orquestador, 2026-09-16)

validar --inbox --correccion --red dio 5 errores de citas, preexistentes en lo publicado y ajenos a esta corrección, que no toca fuentes: medios/augpee (propiedad y alineamiento, https://augpee.org.uy/), politicos/silva-robert (mandatos[0].fuentes[1], parlamento.gub.uy/…/13602/legislaturas-actuo) y empresas/antel (monopolio.normas[3] y hitos[4], impo.com.uy/bases/leyes/17524-2002). Son la misma URL y la misma cita que ya fallan en lo publicado: la copia guardada de esas páginas trae entre 105 y 555 caracteres de texto y la cita no está en ella. Quedan en la deuda de fuentes, que se paga aparte. Se promueve con ellos.
