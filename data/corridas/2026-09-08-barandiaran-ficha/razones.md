# Razones — corrida 2026-09-08-barandiaran-ficha

Editor: Sonnet (`claude-sonnet-5`), por decisión del mantenedor del 2026-09-07 (regla 14 de
`CLAUDE.md`: ningún subagente corre en Fable sin permiso explícito; Opus queda para el crítico).

Punto de partida: el investigador ya había hecho una segunda vuelta sobre `critica.md` antes de que
yo tocara el lote (ver `inbox/barandiaran/ficha/2026-09-08/notas.md`, encabezado "segunda vuelta").
La mayoría de los `corregir` y los dos `bloquea` de `critica.md` ya estaban resueltos en el crudo que
recibí. Lo que sigue son mis cambios sobre ese crudo, más la confirmación explícita de las decisiones
que el investigador ya había tomado y que me corresponden a mí como editor.

## Cambios sustantivos

- **`politicos.yaml` — `cobertura` (nuevo bloque).** Objeción `corregir` de `critica.md`
  (`politicos[0].cobertura`): la ficha iba a mostrar siete secciones vacías sin explicación. Escribí
  el bloque con lo que dejaron los dos `notas.md` (ficha y trayectoria) bajo `para_el_editor` y
  `cobertura_del_periodo`: qué se revisó (documento del Parlamento, Enciclopedia Electoral, diarios
  de sesión de Cámara/Asamblea General/Comisión Permanente, trece medios), qué hay (una
  intervención, la firma de la Ley 17.189, 46 de 110 días de suplencia) y qué no hay (diarios
  anteriores a 2000, prensa fuera de LR21, foto). Verifiqué yo mismo con `pnpm fuente` la cita sobre
  las fechas de digitalización de los Diarios de Sesiones antes de usarla como base del párrafo.
  `fecha: 2026-09-08`.

- **`politicos.yaml` — `estado_actual.salida` (confirmación, no cambio).** El investigador ya había
  movido la fecha de 2004-04-24 (objeción `corregir`, `riesgo_legal`, de `critica.md`) a 2004-12-15,
  la última actividad con fuente directa, y explícitamente decidió no estirarla hasta 2005-02-14
  (fin formal de la Legislatura 45) porque eso sería afirmar que siguió convocable hasta esa fecha
  sin un documento que lo diga para él. Confirmo esa decisión: es la lectura correcta de "lo que la
  fuente permite afirmar" (regla del sitio). La fecha del fin de legislatura queda solo en
  `cobertura.texto`, como contexto, no como el dato de `salida`.

- **`politicos.yaml` — `mandatos[2].fuentes` (nueva objeción, no estaba en `critica.md`).** El
  tercer respaldo del mandato "2000-11-06 a 2000-11-12"
  (`infolegislativa.parlamento.gub.uy/temporales/91556.PDF`) cita la resolución de licencia de Iván
  Posada para esas mismas fechas, pero el texto nombra como suplente convocado a **Ricardo Recuero**,
  no a Gabriel Barandiarán. La fuente no respalda lo que el registro afirma y, además, `pnpm validar
  --red` la marcó caída (HTTP 404) sin copia en Wayback. La saqué. El mandato queda con dos fuentes
  que sí lo sostienen: el documento agregado del Parlamento (que da exactamente ese rango de fechas
  para Barandiarán) y la lista de asistencia del Diario N.º 2901 del 7 de noviembre de 2000, donde
  figura presente. No pude releer el documento caído para entender la discrepancia con Recuero
  (podría ser una convocatoria posterior no capturada, o que Recuero declinó); lo dejo fuera en vez
  de conjeturar.

- **`politicos.yaml` — `mandatos[7].fuentes[0].cita` (corrección mecánica encontrada por `--red`).**
  La cita original cruzaba un salto de página del PDF (el encabezado "Miércoles 5 de noviembre de
  2003 CÁMARA DE REPRESENTANTES 29" quedaba insertado a mitad de la cita), lo que la bajó a
  similitud 0.87 y la hizo fallar el chequeo de citas. La reemplacé por un tramo contiguo de la
  misma resolución de licencia (los incisos 1 y 2, que no cruzan la página) que sostiene lo mismo:
  fecha del período (5 al 8 de noviembre de 2003) y convocatoria de Gabriel Barandiarán como
  suplente. Releí la fuente con `pnpm fuente` para confirmarlo.

- **`eventos.yaml` (nuevo archivo).** `critica.md` («Cobertura») deja un registro de tono con
  `evento: "propuesto: proyecto-datos-personales-2000"` y anota que ese evento no existe en
  `content/eventos/` y que "lo crea el editor antes de promover". Creé el evento (agente: `editor`)
  con la única fuente disponible (LR21, 2000-09-29) y `tema: derechos-humanos`, la categoría más
  cercana disponible en `content/temas/` para un proyecto sobre protección de datos personales (no
  hay un tema de privacidad o tecnología en la taxonomía actual); lo dejo señalado por si en algún
  momento se justifica un tema propio.

- **`cobertura.yaml` (copiado desde `data/corridas/.../cobertura.yaml`, según pidió el brief de esta
  tarea).** Actualicé `evento` al id definitivo (`proyecto-datos-personales-barandiaran-2000`) y le
  agregué `revision: {tier: publicado}`. No toqué `tono` ni `justificacion`: son del crítico y los
  verifiqué contra la misma cita de LR21 que ya había leído.

- **`hipotesis/barandiaran/afiliacion-partido-independiente-post-2004.yaml` (nuevo).** `critica.md`
  (Lote 2, objeción `aviso`, `explicacion_alternativa`) recomienda que la hipótesis sobre una
  continuidad de Barandiarán en el Partido Independiente después de 2004 quede registrada con la
  salvedad de que la Wikipedia de Iván Posada no lo nombra en ese pasaje. La escribí con evidencia a
  favor y en contra tal como está en los dos `notas.md`, tres explicaciones alternativas (ninguna
  descartada) y los cabos sueltos (Corte Electoral sin datos desagregados, 64 días de suplencia sin
  fechar). No va a `content/`.

## Tiers

- `politicos.yaml#barandiaran`: **publicado**. Identidad, partido y mandatos están respaldados por
  el documento oficial del Parlamento; las dos candidaturas quedaron resueltas con la Enciclopedia
  Electoral (los dos `bloquea` de `critica.md`); `estado_actual.salida` tiene fuente directa; los
  huecos que quedan (64 días de suplencia sin fechar, período 1995-2000 sin declaraciones) están
  dichos en `cobertura`, no ocultos. No hay ninguna fuente `verificacion: manual` ni nivel
  `reportado` sin dos grupos.
- `declaraciones.yaml#0`: **publicado**. Nivel `textual` con diario de sesiones (cumple la regla);
  cita corregida y extendida hasta donde el propio orador subordina sus reparos (objeción `corregir`
  de `critica.md`, `cita_fuera_de_contexto`); título y resumen dicen el sentido del voto. Sin datos
  chequeables en la cita (confirmado por `critica.md` y por esta revisión).
- `eventos.yaml#proyecto-datos-personales-barandiaran-2000`: **publicado**. Una sola fuente
  periodística, pero un evento no tiene el requisito de "dos grupos" que sí aplica a `reportado` en
  declaraciones/menciones; el hecho que describe (que se presentó un proyecto) está bien sostenido
  por esa fuente.
- `cobertura.yaml#0`: **publicado**. Tono `neutral` con justificación y cita verificadas.

## Objeciones de `critica.md` — estado final

Resueltas (ya en el crudo de la segunda vuelta o por mí): partido "Nuevo Espacio", los dos `bloquea`
de candidaturas, `estado_actual.salida`, `cobertura`, cita de la declaración, Corte Electoral (vía
Enciclopedia Electoral), los dos errores de hecho de `notas.md` (Ley 17.189 y Comisión de Equidad),
aviso de `mandatos[0]` (LR21 no entra como fuente del mandato, sí a `cobertura`), aviso mecánico de
citas que cruzan de página (verificado con `--red`; solo `mandatos[7]` cruzaba el umbral de error,
el resto quedó en aviso "aproximada" y no lo toqué porque el crítico ya lo clasificó como no
bloqueante).

Sin resolver, documentado y no bloqueante: los 64 días de suplencia de la Legislatura 45 que siguen
sin fecha exacta (de 110 totales, 46 ya fechados); quedan listados en `notas.md >
suplencias_sin_fechar_pendientes` para una vuelta del resolvedor. El defecto de
`LineaMandato.astro` que va a mostrar "Mes 1 de 0" para mandatos de pocos días (señalado por el
crítico) es un problema del componente, no del registro; lo dejo para el informe al mantenedor, no
lo puedo arreglar desde acá.

## Regla 0 y datos personales

El brief de esta corrida (y el de la corrida paralela) afirmaba sin fuente que Barandiarán fue
diputado por el Partido Colorado. Todas las fuentes primarias dicen Nuevo Espacio. No es una
instrucción de calificar u omitir según partido en el sentido de la Regla 0, pero es un dato
afirmado sin fuente en el enunciado, y lo señalo porque tuvo costo real (la corrida paralela gastó
consultas persiguiendo un vínculo colorado inexistente). La ficha quedó con lo que dicen las
fuentes (Nuevo Espacio), no con lo que asumía el brief. El registro no incluye más que actuación
pública: cargos, fechas, partido, una declaración parlamentaria; no hay domicilio, documento ni
dato que dependa de conocer a la persona.

## Cambios de forma

- Ninguno más allá de lo listado arriba: no hubo fechas mal escritas ni erratas de tipeo que
  corregir en este lote.

## Mensaje de commit propuesto

```
Agrega ficha de Gabriel Barandiarán y su declaración de 2000 sobre la ley de trasplantes [corrida 2026-09-08-barandiaran-ficha]
```
