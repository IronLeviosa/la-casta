# Razones — corrida 2026-09-09-barandiaran-suplencias

Editor: Sonnet (`claude-sonnet-5`), por la regla de modelos del mantenedor del 2026-09-07 (el editor
no corre en Fable ni en Opus). Corrida sobre `inbox/barandiaran/ficha/2026-09-08-vuelta-3/`, con
`critica.md` de esa misma vuelta (Opus) como insumo. El `bloquea` (39 fuentes `temporales` caducas)
ya venía resuelto por `/revisar` antes de esta pasada; lo que sigue son los 8 `corregir`.

## Objeciones de `critica.md`, una por una

**`mandatos[2]` (2000-07-05 → 07-07, "20010")** — La única fuente cita, en el listado narrativo del
diario, "por el período comprendido entre los días 5 y 7 de julio de 20010". Releí el mismo PDF
completo con `pnpm fuente --buscar` y encontré, más adelante en el mismo documento, la resolución
votada ("RESUELVE: 1) Concédese licencia... por el período comprendido entre los días 5 y 7 de julio
de **2000**..."), sin ambigüedad. Cambié la cita de la fuente a ese tramo de la resolución; el
mandato no cambia de fecha, cambia la cita que lo sostiene.

**`mandatos[6]` y `[15]` (cita sin fechas)** — Para `[6]` (2000-12-19) agregué una segunda fuente,
mismo diario, con el texto de la Comisión de Asuntos Internos que sí trae la fecha ("...se le
conceda licencia por el día 19 de diciembre de 2000"). Para `[15]` (2001-10-02 → 10-03) reemplacé
las dos citas de asistencia por el tramo que incluye el encabezado de página con la fecha ("Martes 2
de octubre de 2001 ... 1.- Asistencias y ausencias. Asisten los señores Representantes: ... Gabriel
Barandiaran...") en cada uno de los dos diarios, y saqué la tercera fuente (un registro de
inasistencia en la Comisión Permanente, que el crítico marcó como inferencia y que ya no hace falta
con las dos asistencias directas).

**`mandatos[20]` (2002-12-09 → 12-13, dos resoluciones)** — Abrí el diario del 10 de diciembre de
2002 completo (no solo la resolución ya citada) y encontré que la lista de asistencia de esa misma
sesión trae a Barandiarán con una nota al pie: "(3) A la hora 17:35 cesó en sus funciones, con
motivo del reintegro del titular, Sr. Iván Posada". Eso muestra que no son dos resoluciones que se
contradicen sino dos licencias sucesivas del mismo titular (Iván Posada), la primera del 9 al 13 y,
tras un reintegro breve esa tarde, una segunda del 11 al 13 leída en la misma sesión: juntas cubren
el 9 al 13 sin hueco. Agregué las dos citas (asistencia y nota al pie) como fuentes adicionales del
mandato; las fechas no cambian.

**`mandatos[25]` y `[26]` (dos documentos oficiales con un día de diferencia)** — Verifiqué que la
resolución de licencia votada en sala (ya citada en cada mandato) dice "16 y 20 de marzo de 2004" y
"19 y 23 de abril de 2004", mientras que "Parlamentarios Uruguayos" (registro compilado) da un día
más en los dos casos (21 y 24). Cambié `hasta` de cada mandato a la fecha de la resolución votada
(2004-03-20 y 2004-04-23), que es el acto que otorga la licencia, y dejé la cita del registro
compilado con una nota en `titulo` que explica el desfasaje. No encontré, dentro del presupuesto de
esta vuelta, una resolución independiente para cruzar los otros dos mandatos que salen solo de
"Parlamentarios Uruguayos" (2000-11-06 → 12 y 2002-10-09 → 20); lo dejo señalado en
`cobertura.texto` en vez de tocar sus fechas sin evidencia directa.

**`mandatos[16]` (fusión de diciembre de 2001, razón mal escrita)** — La razón que traía `notas.md`
("las tres tienen la misma resolución de origen") es falsa: las propias citas del registro muestran
tres resoluciones de licencia distintas, una por día, del mismo titular. No corregí `notas.md` (no
es mío editarlo), pero `cobertura.texto`, que si es mío, no repite ese error: dice "tres resoluciones
de licencia consecutivas, una por día, del mismo titular". La fusión en sí queda igual (tres días
consecutivos de ejercicio efectivo).

**`estado_actual.salida`** — La única fuente (convocatoria del 15 de diciembre de 2004) prueba una
convocatoria puntual, no un cierre de actuación, y la Legislatura 45 seguía hasta el 14 de febrero de
2005 con 21 días de suplencia sin fechar. Busqué y encontré, en el mismo "Parlamentarios Uruguayos"
que ya usa la ficha, la línea "LEGISLATURA No. 45 - Del 15 de febrero de 2000 al 14 de febrero de
2005": es un dato institucional (fecha de cierre de la Legislatura), no una afirmación sobre esta
persona en particular. Cambié `fecha` a 2005-02-14 y agregué esa fuente; mantuve la fuente de
diciembre de 2004 porque documenta la última actuación conocida, aunque no fecha el cierre. Elegí
esta opción porque no exige agregar un campo que el esquema `Salida` no tiene (no hay `detalle`) y
no le pide a la evidencia probar más de lo que prueba.

**`declaraciones[0]` y `[1]` (fuente caída)** — Encontré la URL estable de la Hemeroteca para las dos:
`2003-11-11 - ... (0068).pdf` para la exposición sobre pasantías (la sesión "(0067)" de ese mismo día
es una sesión solemne distinta, sin la exposición; la ordinaria "(0068)" sí la trae completa) y
`2004-05-12 - ... (0022).pdf` para la intervención sobre corretaje inmobiliario (ya localizada por el
crítico). Reemplacé las dos URLs y extendí la cita de la segunda fuente (`[1]`) para que coincida
con la cita completa del registro, ya que el texto contiguo estaba disponible.

## Otros cambios (no trivial, no pedidos explícitamente por la crítica)

- **Las 4 citas aproximadas** (`mandatos[0]`, `[4]`, `[19]`, `[25]`/`[26]`, todas del PDF
  `parlamentariosuruguayos_.pdf`) se recopiaron literales del texto que devuelve `pnpm fuente`. En
  el proceso encontré que dos de mis primeros intentos de arreglo habían aplicado el texto correcto
  al mandato equivocado (el `old_string` de la edición no era único entre `mandatos[4]` y
  `mandatos[19]`, que comparten casi el mismo tramo del documento): lo detecté porque
  `pnpm validar --red --solo citas` volvía a marcar aproximada la misma cita con el mismo mensaje
  después de "arreglarla", hasta que confirmé con una lectura directa del JSON del corpus cuál
  mandato tenía cuál texto. Quedó: `mandatos[4]` (2000-11-06 → 12) con el texto que ya era exacto en la
  vuelta anterior, sin tocar; `mandatos[19]` (2002-10-09 → 20) con el salto de página ("376") que
  faltaba en la cita original, insertado.
- `_slug` y `titulo` en las dos declaraciones nuevas: el esquema los pide y el investigador no los
  escribe. Elegí `pasantias-discriminan-universidad-catolica` y `corretaje-inmobiliario-articulo-11`.
- `revision: {tier: publicado}` en `politicos.yaml` y en las dos declaraciones: no la tenían.
  `publicado` porque después de las correcciones anteriores toda fuente citada es primaria
  (`diario_de_sesiones` o `documento_oficial`), las 8 objeciones de la crítica quedan resueltas con
  evidencia y no queda ningún `_faltante` abierto sobre el crudo de esta vuelta.
- `cobertura.texto` reescrito: fuentes = Hemeroteca (no más `temporales`), 89/110 días con qué falta
  de los 21 restantes, referencia a `2026-09-09-barandiaran-intervenciones` (107 declaraciones,
  1995-1999) y una oración, pedida por Regla 0, de que para 1995-1999 el sitio todavía no tiene
  cargados a los legisladores de los demás lemas de esa legislatura y que se van a cargar con el
  mismo barrido.

## Cambios de forma

- Comillas dobles agregadas a varias citas nuevas que contienen ": " (dos puntos seguidos de
  espacio), porque sin comillas el parser de YAML las lee como un mapeo anidado y el archivo no
  carga (`Nested mappings are not allowed in compact mappings`).

## Commit sugerido (lo aplica `/revisar` al promover)

```
Barandiarán: suplencias 2000-2004 de infolegislativa (caducas) a la Hemeroteca, 89 de 110 días con cita, dos declaraciones nuevas [correccion 2026-09-09-barandiaran-suplencias-2000-2004]
```
