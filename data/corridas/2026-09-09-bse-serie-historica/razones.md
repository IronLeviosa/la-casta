# Razones — corrida 2026-09-09-bse-serie-historica

Editor: Sonnet (regla del mantenedor, 2026-09-07). Lote: `inbox/empresas/bse/2026-09-09-serie-historica/`.
La vuelta 2 del investigador (Sonnet) ya había resuelto la mayoría de las objeciones de `critica.md`
(Opus, 2 `bloquea`, 12 `corregir`, 6 `aviso`); esto documenta lo que cambié yo sobre ese crudo antes de
cerrar el lote, con la referencia a la objeción cuando corresponde.

## Cambios no triviales

1. **C1 (parcial, quedaba sin cerrar en 2008, 2010 y 2011).** La vuelta 2 corrió el test de
   reconciliación (suma de todos los renglones de la Nota 12 contra el total impreso) para 2012 y 2014
   y lo declaró en el `concepto` de esos dos años, pero no en el de 2008, 2010 ni 2011, que es
   exactamente lo que el crítico objetaba ("el lote no puede aplicar un test para descartar dos años y
   no aplicarlo al año que publica"). Repetí el test releyendo la Nota 12 de los tres años con
   `pnpm fuente` (no estaba en el crudo, lo hice yo): 2008 cierra con $ 1 de diferencia por redondeo
   (suma de once renglones: $ 407.012.305 contra un total impreso de $ 407.012.306), 2010 cierra exacto
   ($ 637.396.131) y 2011 cierra exacto ($ 714.801.518) y de paso confirma que el renglón parcialmente
   ilegible del escaneo ("Gastos de mantenimiento de bienes de uso") es 83.026.699, no otro número.
   Agregué una cláusula a cada `concepto` con el resultado. `impuestos_pagados` queda con el mismo test
   declarado en los seis años publicados de 2005-2014 (2008, 2010, 2011, 2012, 2013, 2014).

2. **Presentación (`finanzas[].nota`, aviso del validador).** `pnpm validar --inbox --red` marca con
   aviso cualquier `nota` de más de 300 caracteres ("al pie de la tabla va una oración"); la de 2005
   tenía 713 (repetía la convención de cotización completa, el cambio de código BCU 2223/2230 y el
   cambio de rótulo IRIC/IRAE, que además ya estaban duplicados en 2006 y en 2015 antes de esta
   corrida). La recorté a 207 caracteres, específica de 2005 (compra/venta del 30/12/2005 y el punto
   medio usado), y moví la convención general al párrafo "Cómo leer la tabla" del `resumen`, que es
   donde vive en el resto de las fichas de empresas (`ancap.yaml`, `ute.yaml`). También acorté la de
   2006 a una oración con la misma referencia.

3. **Error aritmético en el `resumen` que dejó la vuelta 2.** El párrafo de `impuestos_pagados` decía
   "se cargó en dieciséis de los veintiún años" y listaba 2012 entre los años sin dato, pero 2012 sí se
   cargó en esta misma vuelta al resolver C2 (el dígito que no reconciliaba estaba en el total impreso,
   no en el renglón). Son diecisiete años cargados, no dieciséis, y los sin dato son 2005, 2006, 2007 y
   2009. Corregido en el `resumen`.

4. **Base legal de las transferencias en el `resumen` (objeción del crítico al brief, no a un registro
   puntual).** El encargo original de esta corrida decía que el BSE vierte utilidades por el art. 11 de
   su Carta Orgánica; el crítico documentó, leyendo las dos cartas orgánicas (Ley 3.935 de 1911 y Ley
   18.243 de 2007), que ese artículo es sobre el reintegro del servicio de la deuda con que se formó el
   capital fundacional, no una versión de utilidades, y que la obligación de transferir nace cada vez de
   una ley específica o de una instrucción de OPP. La vuelta 2 ya había dejado de citar el art. 11 en los
   campos de `transferencias_al_estado`, pero el `resumen` no explicaba la base legal en ningún lado.
   Agregué al párrafo de transferencias qué años tienen una nota del balance que cita la instrucción de
   OPP (2020, 2023, 2024, con los números de nota) y cuáles no (2009, 2011, 2025).

5. **C10, hitos de designación de presidente — decisión de mantenerlos y declarar el hueco.** La ficha
   tiene tres designaciones con documento primario (2010, 2020, 2025) y ninguna para 2005 ni 2015 pese
   a la búsqueda de la vuelta 2 (`notas.md`, sección "Búsqueda de los hitos de designación de 2005 y
   2015"). El encargo pedía decidir entre sacar las tres o declarar el hueco de las otras dos. Elegí
   mantener las tres y agregar un párrafo al `resumen` que nombra las tres designaciones documentadas y
   dice explícitamente que no se encontró la resolución de 2005 ni la de 2015. Criterio, para que valga
   igual en cualquier ficha: un hito con documento primario no se borra porque falte el hito equivalente
   de otro período; se declara la ausencia donde el lector la necesita, con el mismo estándar que ya usa
   el resto de esta ficha para sus otros huecos (transferencias 2005-2008, impuestos 2005-2007 y 2009, 7
   de los 14 ramos, 1911-2004 completo). Sacar información real y verificada para parecer parejo sería
   peor que declarar el hueco: sería tratar la ausencia de documento como si fuera simetría editorial.
   Nota sobre Regla 0: con Castro (2010, Mujica) sumado a Amorín Batlle (2020, Lacalle Pou) y Otheguy
   (2025, Orsi), las tres designaciones documentadas cubren dos gobiernos del FA y uno de la coalición;
   los dos huecos (2005 y 2015) son ambos de gobiernos del FA. La disponibilidad de documento no está
   sesgada hacia ningún signo político.

6. **Párrafo final "Cómo leer la tabla" en el `resumen` (no estaba).** Todas las demás fichas de
   empresas que declaran convenciones de lectura (ANCAP, UTE, ANTEL, ALUR, BHU, Correo) lo hacen en un
   párrafo final del `resumen` con ese título. La de BSE no lo tenía: las convenciones vivían repartidas
   en el `nota` de 2005, 2006 y 2015 (duplicadas). Escribí el párrafo con las definiciones de
   `resultado_ejercicio`, `impuestos_pagados` (devengado, no caja, decisión ya tomada en la corrida
   anterior del 2026-09-07 y que esta corrida no revisa), `transferencias_al_estado` y
   `deuda_financiera`, y la convención de cotización (código BCU, excepción de 2005-2006).

7. **`revision` (no estaba en el crudo).** Agregué `tier: publicado` y `notas_internas` con los límites
   de esta corrida: años sin `impuestos_pagados` (2005, 2006, 2007, 2009) y sin `transferencias_al_estado`
   (2005-2008), 7 de 14 ramos cargados, hitos de 2005 y 2015 sin documento, la reconstrucción del
   renglón ilegible de 2011, el dígito del total de 2012, la exclusión deliberada del IRAE de
   `impuestos_pagados` en toda la serie, y el aviso A-5 de la crítica de la corrida 2026-09-07
   (monopolio de hecho en renta vitalicia previsional) que sigue sin resolver.

8. **`_correccion.yaml` (nuevo).** `tipo: contexto_omitido`: ninguna cifra ya publicada (2015-2025)
   cambió de valor; todos los cambios en años ya publicados son ausencia → valor (`transferencias_al_estado`
   de 2015-2020, 2023 y 2025, que antes no tenía el campo) o evidencia agregada sin cambiar el valor
   (`capitalizaciones_del_estado` 2023). `afecta: [empresas/bse]`, `cambios[]` por campo
   (`finanzas`, `hitos`, `resumen`) siguiendo el modelo de
   `content/correcciones/2026-09-09-brou-serie-historica-2001-2014.yaml`.

## Cambios de forma

- `finanzas[2006].nota`: reescrita más corta con la misma remisión a la de 2005 (antes decía "ver nota
  de ese año", ahora es una sola oración con los números).
- Ninguna `cita` se tocó: los 183 registros de `pnpm validar --inbox --red` siguen exactos, 0
  aproximadas, 0 manuales, contra el mismo baseline que trajo el crudo.
- **Aviso A4 de la crítica (anclas YAML).** Los años nuevos (2005-2014) usan anclas YAML
  (`fuentes: &aN` / `*aN`) para los segmentos que repiten la misma cita; los años ya publicados
  (2015-2025) repiten el bloque completo. El contenido resultante es idéntico en ambos casos, pero
  `pnpm promover` va a reserializar el archivo entero y el `edicion.diff` va a mostrarse más grande de
  lo que el cambio de contenido real es: no es señal de que se haya tocado más de lo que este documento
  describe.

## Validación

`pnpm validar --inbox inbox/empresas/bse/2026-09-09-serie-historica`: 0 errores (609 registros, 22
avisos, ninguno sobre este lote).
`pnpm validar --inbox inbox/empresas/bse/2026-09-09-serie-historica --red`: 0 errores — 132 URL(s)
verificadas, 183 citas (183 exactas, 0 aproximadas, 0 manuales, 183 de caché).

## Mensaje de commit sugerido

`[correccion 2026-09-09-bse-serie-historica-2005-2014]`
