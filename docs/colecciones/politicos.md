# Fichas de políticos (`content/politicos/`)

Una ficha por persona con cargo electivo o de gobierno: identidad, mandatos con fuente, estado actual y alias. Es una colección de referencia (semilla) y a la vez la que más registros tiene; cada regla de acá salió de un lote que la rompió, y vale igual para las 99 bancas.

## Campos

`nombre`, `nombre_corto`, `partido`, `alias[]`, `alias_ambiguos[]`, `mandatos[]` con `{cargo, desde, hasta, fuentes[]}`, `estado_actual: {situacion, salida: {tipo, fecha, fuentes[]}}`, `candidaturas[]`, `cobertura: {texto, fecha}` cuando corresponde, `foto` con crédito y licencia, `wikidata`. Ejemplo en `docs/ejemplos/politico.yaml`.

## Reglas de identidad y mandatos

1. **Censo primero, por documento oficial, no por la lista del brief.** La nómina de titulares de una legislatura es `documentos.diputados.gub.uy/docs/LegxPartido.pdf` (con las notas al pie de sustitución) y `LegAlfab.pdf` (partido y departamento junto al nombre); para una legislatura pasada, la captura archivada de esa nómina en Wayback. Quien figura ahí es titular, y su ficha lleva ese mandato con esa cita; quien no figura solo lo es si un diario de sesiones o su página oficial lo dice con el cargo.
2. **Sin la línea que nombra el cargo, no hay mandato.** En la página de actuación del legislador, una fila solo prueba un cargo cuando antepone «Representante Nacional por el Lema PARTIDO - Legislatura N» (o la equivalente de Senador). Una fila pelada con dos fechas puede ser una suplencia de un día, un pasaje al Senado o un dato incompleto. Ninguna fecha se llena por defecto: cada `desde`, `hasta` y `salida.fecha` sale de la página de actuación (convocatoria por convocatoria), de la resolución de licencia del diario de sesiones, o de la nómina; nunca de una lista de asistencia ni de un índice.
3. **Un tramo de senador no es un mandato de diputado.** «Convocado a la Cámara de Senadores» va como `cargo: Senador (suplente)` o `Senador`, con la fecha y el titular al que suple, y el mandato de Representante termina con la renuncia a la banca cuando el diario la registra.
4. **El mismo criterio para el mismo hecho.** Una suplencia de uno o pocos días es un mandato con `cargo: "Representante Nacional por <Departamento> (suplente)"` y sus fechas exactas, nunca un mandato de titular ni una fila omitida; cada convocatoria de un suplente es un mandato aparte y nunca se funden en un tramo de años; todas las convocatorias se cargan, sin tope (la página condensa lo repetido). El pasaje de un titular al Poder Ejecutivo o a una intendencia no corta su mandato de Representante: sigue hasta el fin del período o hasta la renuncia documentada, y el cargo ejecutivo es otro ítem de `mandatos[]` con su fuente.
5. **Tipos de salida.** `salida.tipo: fin_de_mandato` solo en la fecha de fin del período (14/02/2025 para la XLIX). Una renuncia, un fallecimiento, un pasaje al Senado o al Ejecutivo llevan su propio tipo y la fuente que lo dice. `fin_de_convocatoria` para el suplente cuya última convocatoria terminó en una legislatura en curso sin renunciar: `fecha` es el último día de esa convocatoria, con el diario que la registra. `situacion: en_cargo` solo con un mandato abierto y su fuente.
6. **Departamento y partido salen de la nómina**, no de la fila desordenada de tres columnas del PDF de la Cámara.
7. **Ids y alias.** El `_slug` sigue la grafía de la fuente oficial (`inthamoussu-pablo`, no `inthamoussou-pablo`; `rodriguez-carlos`, sin departamento). Un alias compartido por dos personas (padre e hija, homónimos) se retira de las dos fichas y queda solo el nombre completo. Una persona con dos fichas es un error que se resuelve con una corrección, no con una tercera ficha.
8. **Quien fue diputado y hoy es senador, o al revés, tiene una sola ficha** con todos los mandatos, cada uno con su fuente.
9. **`verificacion: manual` no se usa para documentos que `pnpm fuente` puede leer.**
10. **Cobertura.** Una ficha de identidad sin declaraciones, promesas ni chequeos no queda muda: la página lo dice sola cuando la ficha no trae `cobertura`. `cobertura: {texto, fecha}` se escribe cuando los investigadores dejaron en `notas.md` (`cobertura_del_periodo`, `medios_faltantes`) qué medios y archivos se revisaron, qué período, qué hay y qué no existe en la web, sin adjetivos, en cinco o seis oraciones; no en fichas de identidad generadas por script.

Nada de esto se aplica distinto a un partido que a otro: el documento que se le exige a un diputado se le exige a los 99.

## Fichas generadas por script

Las fichas de suplentes se generan desde las resoluciones de licencia de los diarios de sesiones y el JSON oficial de actuación, sin ningún modelo. Llevan procedencia de tipo `script` (`CLAUDE.md`, «Procedencia obligatoria»), el script vive en `scripts/`, y el cotejo de fechas se hace contra el JSON oficial, no contra la cita. Sobre un lote generado por script corre primero un solo lote hasta el crítico (regla de piloto); los demás, después.
