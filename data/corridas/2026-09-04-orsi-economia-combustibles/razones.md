# Razones — corrida 2026-09-04-orsi-economia-combustibles

Editor: Claude Sonnet 5 (claude-sonnet-5), corrida deliberada bajo el experimento de
`EXPERIMENTO.md` (editor con Sonnet en vez de Fable; el crítico de este lote también corrió con
Sonnet en vez de Opus, ver nota al inicio de `critica.md`).

## Cambios de forma

- `declaraciones.yaml`, registro 2026-05-26 ("Igual, creo que Ancap está abasteciéndose..."): se
  quitó el punto final que el investigador agregó al copiar y que la fuente no tiene, en `cita`
  y en `evidencia.fuentes[0].cita`. Hecho en el paso 1, antes de esta revisión (nota del
  orquestador). El validador pasó de 0.99 a 1.00. No cambió el sentido.

## Cambios sobre el crudo (no triviales)

1. **`declaraciones.yaml[0]` (2024-09-13) y `menciones.yaml[0]`**: reescribí el `resumen` de
   `declaraciones[0]` para aclarar que la frase fue parte de un cruce mayor sobre el plebiscito
   de la reforma de la seguridad social (Expo Prado), y que "combustibles" apareció como
   coletilla junto a "edad jubilatoria", no como crítica desarrollada de política de
   combustibles. Motivo: objeción aviso/`contexto_omitido` de `critica.md` en `declaraciones[0]`
   y `menciones[0]`. No cambia la cita ni el `sentido: negativo` de la mención (que el crítico
   confirmó bien clasificado), sólo evita que el registro se lea aislado como si fuera una
   posición desarrollada de Orsi sobre combustibles.

2. **`promesas.yaml`, evidencias[1] (2026-06-30, baja de precios de julio)**: agregué una
   segunda fuente (subrayado, grupo `fontaina-de-feo`) con la misma cifra de gasoil ($61,76 a
   $58,68) que ya traía el-observador (grupo `werthein-hochbaum`). Motivo: objeción `bloquea` de
   `critica.md` ("única fuente... no alcanza el requisito de dos grupos distintos"). Verifiqué
   personalmente la cita en la fuente con `pnpm fuente` antes de incorporarla. Queda resuelta la
   objeción; esta evidencia pasa a cumplir nivel `reportado` con dos grupos.

3. **`promesas.yaml`, evidencias[2] (2026-09-01, congelamiento de setiembre)**: bajé `tipo` de
   `dato_oficial` a `declaracion`. Motivo: objeción `corregir` de `critica.md` ("no hay un
   documento publicado... citado en ninguna de las dos notas, solo declaraciones orales de la
   ministra Cardona"). No encontré en esta revisión el comunicado del MIEM ni el informe de
   Ursea que sustituirían la declaración por un documento oficial; queda anotado en
   `revision.notas_internas`. La evidencia sigue en el lote porque, con el `tipo` corregido,
   cumple la letra de la regla de dos grupos (caras-y-caretas + infobae), con la salvedad
   documentada de que infobae reproduce un despacho de EFE.

4. **`promesas.yaml`, evidencias[0] (2026-05-01, suba de mayo)**: corregí `tipo` de
   `dato_oficial` a `accion_de_gobierno`, para ser consistente con evidencias[1] (misma
   categoría de hecho: el gobierno fija el precio mensual del combustible, en un caso sube y en
   el otro baja). No es una objeción del crítico, es una corrección de consistencia interna que
   dejo constando igual.

5. **`promesas.yaml`, evidencias[3] (2026-03-01, denuncia del PN de 90 millones)**: la mantuve
   en el lote pese a la objeción `bloquea` de `critica.md` (única fuente, cadena de atribución
   larga: PN → Centro de Estudio de Políticas Públicas → Ámbito). Motivo: la `descripcion` ya
   atribuye correctamente la cifra a una denuncia de terceros, no la presenta como hecho propio
   del investigador; "falta una segunda fuente" es exactamente la definición de tier `probable`,
   no motivo por sí solo para moverla a hipótesis. Abrí
   `hipotesis/orsi/verificacion-sobreprecio-90m-pn-2026.yaml` para la verificación independiente
   pendiente (contra PPI de Ursea / decretos IMPO), y bajé el tier de la promesa completa a
   `probable` por esta evidencia (ver "Simetría" abajo).

6. **`promesas.yaml`**: agregué `estado: en_proceso_adelantada` y `fundamentacion`, ponderando
   las 4 evidencias (2 acciones de gobierno de precio por debajo del PPI recomendado a favor, 1
   suba por shock externo en contra con menos peso porque no hay evidencia de que se apartara
   del PPI en esa dirección, 1 denuncia opositora de fuente única y sin verificación
   independiente en contra con menos peso que las acciones de gobierno documentadas por dos
   fuentes). Detalle del balance en `fundamentacion` del propio archivo.

7. **Cuatro archivos de hipótesis** en `hipotesis/orsi/`: `giro-impuestos-combustibles-fa-oposicion.yaml`,
   `espaciamiento-ajuste-ppi-reversion-2025.yaml`, `disputa-cifras-ancap-abril-2025.yaml` y
   `verificacion-sobreprecio-90m-pn-2026.yaml`. Las primeras tres corresponden a las hipótesis
   ya abiertas en `notas.md`; la cuarta la abrí a partir de la objeción `bloquea` de
   `promesas[0].evidencias_candidatas[3]`. Ninguna pasa a `content/`.

8. **`giros.yaml` se crea vacío**: no hay ningún par de declaraciones "antes/después" completo
   en el lote (`notas.md`, `candidatos_giro`). El candidato más fuerte (impuestos al combustible,
   FA en oposición vs. Orsi presidente) quedó en hipótesis por falta de la cita "antes".

## Simetría (punto 3 del encargo del editor)

Las dos menciones del lote a Lacalle Pou son negativas (críticas de Orsi por incumplir "no tocar
los combustibles" y por la deuda de Ancap), y el crítico señaló que falta el contrapunto de que
el gobierno de Lacalle Pou también se apartó del precio de paridad de importación (fijando
precios por debajo de lo recomendado, con una brecha de ~60 millones de dólares en 2024, según
Ámbito). Antes de cerrar me pregunté si estoy aplicando a Orsi el mismo umbral que a Lacalle Pou
en las corridas de setiembre:

- El criterio con el que bajé el tier de la promesa de Orsi a `probable` por una sola evidencia
  sin segunda fuente (la denuncia del PN de 90 millones) es el mismo que aplicaría a una
  evidencia equivalente en una promesa de Lacalle Pou con una sola fuente: cualquier evidencia
  con `_faltante: segunda_fuente` fuerza `probable` en el registro completo, sin importar si
  beneficia o perjudica al político de la promesa. No hay una promesa de Lacalle Pou en este
  lote para comparar directamente (es otro político, otro tema), pero es el mismo estándar de
  "dos grupos para reportado" que ya regía en las 4 promesas de Lacalle Pou sobre impuestos y
  tarifas (commit `5b6107f`).
- No agregué contexto favorable a Lacalle Pou dentro de las declaraciones o menciones de Orsi
  (eso habría sido fabricar una "defensa" que ninguna fuente citada por Orsi mismo respalda).
  En cambio, documenté la disputa de cifras de Ancap y el apartamiento del PPI por el gobierno
  de Lacalle Pou en un archivo de hipótesis separado (`disputa-cifras-ancap-abril-2025.yaml`)
  con `evidencia_a_favor` y `evidencia_en_contra` de la hipótesis, con el mismo formato que usé
  para las hipótesis desfavorables a Orsi. Esto es simétrico: no suavicé la crítica de Orsi a
  Lacalle Pou (las menciones quedan `publicado`, `sentido: negativo`, tal como las clasificó el
  investigador y confirmó el crítico) ni la dejé sin contrapeso: el contrapeso queda accesible
  para cuando haya una corrida de investigación sobre esta disputa específica de Ancap.
- Con un N de 2 menciones (todo el material de Orsi sobre Lacalle Pou en este lote), coincido
  con el crítico en que no hay base para sacar conclusiones de patrón; no traté "2 de 2
  negativas" como una señal de nada.

## Objeciones de `critica.md` que quedan sin resolver

- **declaraciones[1] / menciones[1]**: la sugerencia de proponer un chequeo de Veracímetro
  contra el balance auditado de Ancap para las cifras de 118/255 millones no se resolvió en esta
  corrida porque implica una investigación nueva (conseguir el balance auditado, documento
  oficial) que excede el rol de edición; queda como hipótesis
  (`disputa-cifras-ancap-abril-2025.yaml`) para una futura corrida de investigación.
- **declaraciones[3]**: la hipótesis del giro sobre impuestos al combustible sigue sin la cita
  "antes"; ni el investigador, ni el crítico, ni yo la encontramos. Queda abierta en hipótesis,
  con pistas concretas de dónde buscar.
- **promesas.yaml evidencias[3] (90 millones)**: la objeción `bloquea` no se resuelve en el
  sentido de conseguir una segunda fuente -no la conseguí, y el propio crítico ya había revisado
  sin éxito Telenoche y Caras y Caretas-; se resuelve en el sentido de que el registro queda en
  tier `probable`, correctamente marcado, con la verificación pendiente documentada en
  hipótesis.

---

## Nota de proceso (la escribe el orquestador, no el editor)

`edicion.diff` de esta corrida está vacío, y eso **no** significa que el editor no haya cambiado
nada. Significa que `crudo/` se congeló tarde.

`pnpm promover` copia `crudo/` una sola vez, la primera vez que se lo corre. En esta corrida la
primera corrida de `promover` fue después de que el editor ya había asignado tiers, agregado una
segunda fuente a una evidencia y creado `giros.yaml`. Lo que quedó guardado como "crudo", entonces,
es la versión ya editada, y el diff contra sí misma da vacío.

Los cambios del editor sí están documentados: son los que este mismo archivo enumera más arriba.
Lo que se perdió es la posibilidad de verificarlos automáticamente contra el estado anterior.

El defecto se corrigió el mismo día: `pnpm promover --solo-crudo` congela el crudo apenas se valida
el inbox, y `.claude/commands/revisar.md` lo incorporó como paso 1b, antes del crítico y del editor.
La corrida `2026-09-04-orsi-transparencia-corrupcion` ya tiene el crudo congelado a tiempo. La
corrida `2026-09-04-orsi-economia-impuestos` comparte esta misma limitación, por la misma razón.
