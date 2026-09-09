# Razones — corrida 2026-09-07-empresas-alur (edición)

Editor: Sonnet, corrido por regla del mantenedor (2026-09-07: el editor no corre en Fable ni en
Opus). Este archivo cubre solo lo que yo cambié sobre el crudo de la **vuelta 2** del investigador
(`inbox/empresas/alur/2026-09-07/notas.md#vuelta_2`), que ya resolvió los 3 `bloquea` y los 16
`corregir` de `critica.md` (verifiqué esa resolución uno por uno contra `critica.md` antes de tocar
nada; el detalle está en el informe final, no acá, porque no son cambios míos).

## Cambios sustantivos

1. **`empresas.yaml#resumen` (nuevo).** El campo no existía; lo escribe el editor por regla del
   esquema (`empresa.ts`: "Lo escribe el editor a partir de los datos de la ficha"). Nueve párrafos:
   qué es ALUR y de quién, el resultado 2006-2025 en dólares (con los años sin cotización de cierre
   declarada), la deuda y las cuatro plantas, las capitalizaciones de ANCAP año por año (con los
   cuatro años sin evidencia de aporte nuevo y por qué), el diseño legal de la Ley 18.195/19.996, los
   dos lados documentados, la Comisión Investigadora del Senado, los años con OCR parcial, y un
   párrafo final "Cómo leer la tabla" con la moneda funcional dual, la excepción de 2019 y la
   convención de `segmentos[]`. Motivo: encargo directo del editor (ítem 1 del brief de esta sesión);
   sin `resumen` la ficha no tiene el resumen que el lector necesita para no tener que reconstruir
   veinte años de notas al pie.

2. **`empresas.yaml#precios_vs_paridad.descripcion` acortada** de tres oraciones (665 caracteres) a
   dos. Motivo: encargo directo (ítem 3 del brief), mismo contenido, sin recorte de información.

3. **Tres `concepto` de `finanzas[]` acortados a una oración**, moviendo el detalle metodológico al
   `resumen` (que es donde la lista de control pide que viva lo que se repite):
   - `finanzas[2019].resultado_ejercicio.concepto` (292 caracteres, dos oraciones → una).
   - `finanzas[2021].resultado_ejercicio.concepto` (568 caracteres, cuatro oraciones → una; la
     explicación de la NIC 21 y el cambio de contrato de biocombustibles ya están en el `resumen`).
   - `finanzas[2008].capitalizaciones_del_estado.concepto` (257 caracteres, tres oraciones → una).
   Motivo: sección "Presentación" del rol de editor ("`concepto` y `nota` son una oración, porque van
   como notas al pie de la tabla") y lista de control punto 5. Ninguno de los tres tenía objeción de
   `critica.md`; son ajustes de forma sobre contenido ya correcto.

4. **Dos citas corregidas tras `pnpm validar --inbox --red`** (131/133 exactas al entregar el lote;
   las dos restantes eran `documento_oficial`, así que las recopié en vez de dejarlas aproximadas,
   como pide el encargo):
   - `empresas.yaml#hitos[2008].fuentes[0].cita`: faltaba el número de nota al pie "571" que el PDF
     del informe del Senado intercala entre "cuatro" y "proyectos" (verificado con
     `pnpm fuente ...InformeFinalAncap.pdf --buscar "se informó que Alur lleva invertidos"`). Se
     restituyó tal cual aparece en el texto extraído.
   - `empresas.yaml#finanzas[2009].deuda_financiera.fuentes[0].cita`: la última línea decía "Total
     Pasivo No Corriente 751.346.450 797.850.033"; el balance 2009 de ALUR dice literalmente "Total
     Pasivo Corriente 751.346.450 797.850.033" en esa fila (un error del propio documento, que repite
     el rótulo de la fila de arriba en vez de escribir "No Corriente"; verificado con
     `pnpm fuente .../balance-2009.pdf --buscar "Deudas comerciales 9 259.173.222"`). Se corrigió la
     cita para que coincida con el documento, no con lo que "debería" decir: una cita es copia
     literal, y el error es del balance, no de la ficha.

5. **`empresas.yaml#revision` (nuevo).** `tier: publicado`. Motivo del tier: los 20 años de
   `finanzas[]` están respaldados por estados financieros individuales auditados o su columna
   comparativa declarada como tal; el monopolio documenta 3 argumentos a favor y 3 en contra con el
   mismo esfuerzo y en el mismo período (2021, más anclajes de 2007/2015 y 2016); las 133 citas del
   lote pasan `--red` exactas; y el validador confirma que las 27 conversiones pesos↔dólares con
   `cotizacion` cierran dentro del 1,5 %. `notas_internas` documenta lo que queda sin resolver y por
   qué no bloquea publicado: sin capitalización documentada en 2006/2010/2013/2014 (con la explicación
   contable de cada uno donde la hay), sin diario de sesiones de la Ley 19.996, sin el informe
   completo del MIEM (el argumento que se apoya en él queda en nivel reportado con dos grupos de
   medios, la-diaria y El Observador, que sí alcanza), y la diferencia sin explicar entre el total de
   tributos de 2021 según el balance propio y según la comparativa del balance 2022.

6. **`analisis.yaml#revision` (nuevo).** `tier: publicado`. Las tres calificaciones de las
   afirmaciones de Rossa quedan `discutible`, como las entregó el investigador: no hay, en esta
   corrida, un documento oficial con el precio de importación de referencia de etanol o biodiésel
   para 2012-2014 que permita reconstruir el cálculo (regla dura del Veracímetro: verde, lima y rojo
   solo con documento oficial que permita verificar la cifra, no solo citarla). `discutible` con un
   análisis honesto de qué falta es un estado final legítimo, no una calificación pendiente; por eso
   el registro se publica igual. `notas_internas` deja dicho que el Anexo 9 del informe del Senado
   (el dictamen completo de Rossa, no leído en esta corrida) es lo único que podría subir alguna
   afirmación.

7. **`content/medios/alur.yaml` (nuevo, escrito directamente en `content/`).** `notas.md#medios_faltantes`
   pidió esta ficha; por regla del editor (`CLAUDE.md`, "la única parte de `content/` que sí
   escribís"), la escribo yo, no queda en el inbox. Copié el borrador de
   `inbox/empresas/alur/2026-09-07/medios/alur.yaml`, agregué `revision: {tier: publicado}` (el
   esquema de medios lo exige y el borrador no lo traía) y corregí, solo en la prosa (`propiedad.descripcion`
   y `alineamiento.justificacion`, nunca en las `cita`, que son copia literal y ya decían "Alcoholes y
   Portland" porque así lo escribe el propio balance), el nombre completo de ANCAP a "Administración
   Nacional de Combustibles, Alcohol y Pórtland", como en el resto de las fichas de la colección.

## Cambios de forma

- Ninguno más allá de lo anotado arriba: no encontré fechas, nombres ni cifras mal escritas fuera de
  las dos citas corregidas en el punto 4, que son de contenido (afectan si la cita es literal), no de
  forma.
