# Declaraciones (`content/declaraciones/`)

Qué dijo la persona, cuándo, en qué contexto y con qué palabras. Es la colección base: los giros comparan dos declaraciones, los chequeos nacen de los datos que hay dentro de una cita, y las menciones son declaraciones sobre otra persona.

## Campos

`politico`, `tema` (slug de `content/temas/`, jerárquico), `fecha`, `contexto` (`campaña | gobierno | oposicion | entrevista | parlamento | redes`), `cargo_en_ese_momento`, `cita` (literal, contigua, al menos 20 caracteres, tal como la devolvió `pnpm fuente`), `titulo`, `resumen` (una oración neutra: qué afirmó, sin adjetivos), `evidencia` (`nivel` y `fuentes[]`), `seguimiento` cuando corresponde. Ejemplo completo en `docs/ejemplos/declaracion.yaml`.

## Investigación

- **Conferencia de prensa, discurso, cadena nacional o acto oficial: el texto oficial existe casi siempre, y se busca antes de citar al periodista.** Presidencia publica la versión completa (`archivo.presidencia.gub.uy` para mandatos anteriores, `medios.presidencia.gub.uy` para documentos y discursos, `www.gub.uy/presidencia/comunicacion/noticias/` para el mandato en curso; la raíz de esos dominios da 403, las rutas profundas se leen bien); la gacetilla trae un resumen. Citar la crónica da `reportado` y exige dos grupos de medios; citar el documento oficial da `textual` y no exige segundo grupo. En el Parlamento, el diario de sesiones también habilita `textual`. Si no aparece el texto, los streams del canal de YouTube de Presidencia (`@PresidenciaUruguay-b2s`) sirven para ubicar el pasaje y la `marca_tiempo` (`yt-dlp --skip-download --write-auto-subs --sub-langs es`), nunca para citar: para citar de audio se transcribe con `pnpm transcribir`.
- **Cotejo con el registro primario.** Si el registro tiene una fuente primaria (audio, video, texto oficial) y además notas de prensa que citan a la persona, cada nota lleva `verificada_en: {url: <la primaria>, marca_tiempo: <dónde está el pasaje>}`. El investigador no decide si la nota es fiel: eso es `literalidad`, y la pone el editor con el `contexto` de la primaria a la vista.
- **Datos dentro de la cita.** Cada cifra, fecha, cantidad o comparación que la persona afirma es un chequeo: ver `chequeos.md`.
- **Toda denuncia lleva desenlace.** Si la persona dice que algo es ilegal, inconstitucional o irregular, o pide algo concreto, se busca qué pasó después (diarios de sesiones posteriores, pedidos de informes y sus respuestas, resoluciones en IMPO, prensa) y se carga en `seguimiento` (`estado: resuelto | sin_resolucion_publica`, `fecha`, `texto`, `fuentes`); si no hay registro público, `sin_resolucion_publica` y dónde se buscó. El lector que lee «esto es inconstitucional» quiere saber si se salieron con la suya.

## Edición

- **`titulo`** según `presentacion.md`, punto 1.
- **Las erratas del medio no van al resumen.** Si el medio tipeó mal, se anota en `notas_internas` y, si la cita ya está verificada contra una fuente primaria, el resumen escribe la palabra bien. Si la única fuente es la nota con la errata, la cita la conserva (es literal) y el resumen escribe la palabra correcta sin comentar el error.
- **`literalidad`** de cada nota de prensa contra la primaria, con el `contexto` a la vista: `literal` si calza, `condensada` si recorta sin cambiar el sentido, `difiere` si no coincide (y entonces `verificada_en.diferencia` dice en qué, sin verbos de intención), `aproximada` solo para lo que no se pudo cotejar.
- **Fuente primaria y cobertura.** Una entrevista, una conferencia o un discurso es una fuente aunque se citen tres pasajes; la página agrupa por URL y separa la primaria de la cobertura de prensa.

## Crítica

Contexto omitido (el párrafo entero de cada cita, con `pnpm fuente --buscar`), cita cortada donde cambia el sentido, dos frases separadas unidas, ironía o cita de un tercero, dependencia de un solo grupo en `reportado`, y, cuando hay primaria, si la nota dice lo mismo que el original.
