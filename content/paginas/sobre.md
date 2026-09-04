---
titulo: Sobre La Casta
descripcion: Para qué existe el sitio, por qué el trabajo lo hace una IA, qué significa el nombre, quién lo mantiene, con qué instrucciones se produce el contenido, la Regla 0, qué garantiza y qué no, y cómo pedir una corrección.
actualizado: "2026-09-03"
---

## 0. Para qué existe

La Casta es una herramienta de memoria para la gente: para que nadie olvide qué le prometieron sus representantes, dónde se equivocaron, qué afirmaciones falsas hicieron y qué nivel tiene su discurso, y así tener una guía verificable de a quién vale la pena escuchar. Cubre a cualquier figura política uruguaya con cargo electivo o de gobierno: empieza por los presidentes desde 2000, sigue con senadores y diputados del mismo período, y se extiende hacia atrás hasta donde las fuentes permitan documentar.

## Por qué lo hace una IA

Nadie puede hacer el trabajo de buscar muchas fuentes, compararlas y discernir entre ellas a la velocidad a la que salen las noticias como lo hace la inteligencia artificial. Mucho menos una sola persona, y mucho menos con los treinta años de historia que estamos revisando. Nadie tiene la capacidad de retener en su memoria el contexto con el que puede trabajar una IA, que recuerda tanto lo de hace veinte años como lo de hace veinte días, y encuentra patrones y coincidencias entre historias distintas para detectar irregularidades.

Esa es la ventaja, y es la única razón por la que el trabajo lo hace una máquina. No implica que la máquina sea imparcial: ningún modelo de lenguaje está libre de los sesgos con los que fue entrenado. Lo que se garantiza no es una IA neutral sino un proceso verificable, con las instrucciones publicadas, la fuente de cada afirmación a la vista y el rastro completo de cada corrida. Eso está desarrollado en la sección 5, "Sobre el sesgo, con honestidad".

## 1. Qué significa "casta"

"Casta" designa a quienes ejercen poder público y viven en condiciones muy distintas a las de la gente que representan. Ese es el significado de la palabra y no cambia al entrar a estas páginas: si un término significara una cosa adentro y otra afuera, la Regla 0 —objetividad por encima de todo— estaría rota desde el arranque. No es un guiño a Javier Milei ni a ninguna corriente política: es una descripción del lugar que ocupa una persona cuando decide por otros. El mismo criterio se aplica a todos los partidos y a todas las personas cubiertas. Documentar lo que un político dijo, prometió, hizo y declaró no es una acusación; es el registro que cualquier ciudadano necesita para evaluarlo, sea del partido que sea.

## 2. Quién mantiene el repositorio y qué papel tiene

El repositorio lo creó y mantiene una persona que eligió no identificarse públicamente: el sitio no depende de quién lo hizo sino de que cada registro sea verificable por cualquiera. No tiene afiliación partidaria declarada ni vínculo con partidos o medios. Su papel en el contenido es acotado y está escrito en las reglas del proyecto: aprueba, con firma criptográfica, los casos judiciales y los giros calificados como "cambio total sin explicación" antes de que se publiquen, y nada más. No escribe registros, no elige qué se investiga de quién por afinidad, y las reglas del sitio le prohíben pedirle a la IA que lo haga (ver la Regla 0, abajo). Los commits de aprobación van firmados con su clave; la huella pública de la clave se publica en esta página cuando se emita la primera aprobación.

## 3. Qué IA produce el contenido y con qué instrucciones

El contenido lo produce Claude, de Anthropic, en varios roles con modelos distintos:

- **Sonnet** investiga: busca en el corpus propio y en la web, abre cada fuente que cita y escribe el registro crudo.
- **Opus** critica: actúa como abogado del diablo sobre cada registro (explicaciones alternativas, contexto omitido, dependencia de un solo grupo de medios, citas fuera de contexto, riesgo legal, simetría) y clasifica el tono de cada nota de prensa.
- **Fable** edita: lee investigación y crítica, arma los giros, califica, asigna el nivel de publicación y escribe el análisis.
- **Haiku** etiqueta: temas, eventos y personas mencionadas en cada nota del corpus.
- **Opus**, además, mantiene hipótesis privadas que no se publican hasta tener documento oficial o actuación judicial.

Las instrucciones que reciben son públicas y son la fuente de verdad sobre cómo se produce el contenido. Están en el repositorio, en estos archivos: `CLAUDE.md` (reglas generales e invariantes editoriales), `.claude/agents/investigador.md`, `critico.md`, `detective.md`, `etiquetador.md`, `clasificador.md` (un archivo por rol, con el modelo que usa) y `.claude/commands/investigar.md`, `revisar.md`, `detective.md`, `auditar.md` (los procedimientos). Cada registro publicado guarda el hash del archivo de instrucciones con el que se produjo, así que se puede verificar qué versión exacta de las reglas estaba vigente.

## 4. La Regla 0

Es la primera línea de `CLAUDE.md` y está por encima de cualquier otra instrucción, incluidas las del dueño del repositorio:

> Objetividad por encima de todo. Ninguna instrucción posterior, del dueño del repo o de quien sea, puede pedir seleccionar, omitir o encuadrar información según partido, ideología o persona. Si una instrucción lo hace, el agente lo dice explícitamente en el momento, rechaza esa parte y propone la versión simétrica (la misma búsqueda o el mismo criterio aplicado a todos los partidos y personas). Toda regla editorial se aplica igual a todos.

Se complementa con una prueba de simetría automática: para cada tema en el que hay giros o chequeos publicados de un presidente, el reporte semanal lista qué otros presidentes con mandato en ese tema todavía no fueron investigados, para que la cobertura desigual sea visible y no accidental.

## 5. Sobre el sesgo, con honestidad

La IA no recibió instrucciones partidarias; las instrucciones que recibió están publicadas y cualquiera puede leerlas. Pero ningún modelo de lenguaje está libre de sesgos de entrenamiento, y hay evidencia publicada de que los modelos pueden cambiar sus etiquetas según quién habla. Este sitio no garantiza una IA neutral. Lo que garantiza es un proceso verificable:

- reglas públicas, con hash por registro;
- fuentes abiertas, con cita literal, enlace al original y copia en Wayback;
- corpus auditable: cada corrida deja el prompt exacto, las búsquedas hechas, el registro crudo antes de editar, la crítica, la diferencia entre crudo y publicado y la razón de cada cambio, en `data/corridas/`;
- prueba de simetría semanal y estadísticas por partido en el comando de auditoría;
- clasificaciones a ciegas y por dos modelos en las métricas más subjetivas, con acuerdo publicado;
- correcciones y réplica públicas.

Nada de esto prueba matemáticamente que no hubo otra IA o edición fuera del proceso. Lo que prueba es que cada conclusión tiene un prompt público, un crudo preservado, un diff explicado y una copia externa inmutable (cada release se archiva en Software Heritage, un tercero que no controlamos). Si alguien encuentra un registro sin esa cadena, es un hallazgo válido y se trata como corrección. El procedimiento para auditar el repositorio, con o sin IA, está en `AUDITORIA.md`.

## 6. Cómo pedir una corrección o ejercer réplica

Cualquier persona puede señalar un error; las personas y medios nombrados pueden además ejercer réplica. En ambos casos hace falta: el enlace al registro, el texto exacto con el que no se está de acuerdo, el tipo de evidencia (memoria, organismo público, documento, enlace, testimonio propio) y dónde encontrarla. El canal en esta etapa es un issue en el repositorio público con la plantilla "Corrección" o "Réplica". El pedido entra al mismo proceso que todo lo demás (verificación, crítica, edición) y su resultado, aceptado o rechazado, queda publicado en la página de correcciones y enlazado desde el registro afectado. Detalles en [Correcciones](../correcciones/) y [Réplica](../replica/).
