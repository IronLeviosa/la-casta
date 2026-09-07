# Brief de investigación · corrida 2026-09-07-metodo-ministerio-interior

Regla 0: objetividad por encima de todo. Este encargo no produce registros sobre nadie: produce un mapa de método, igual para cualquier caso de cualquier político.

## Encargo

Un chequeo quedó en «discutible» porque le faltaba un documento oficial que existía (el prontuario de una persona leído en el Senado). El mantenedor pidió que se analice a fondo **cómo se consiguen los documentos oficiales de los casos penales y administrativos**, empezando por el Ministerio del Interior, que es la fuente natural de legajos, antecedentes, investigaciones administrativas y estadísticas de delito, y siguiendo por las demás puertas: Parlamento, Fiscalía, Poder Judicial, Presidencia, IMPO y el acceso a la información pública.

Escribí `docs/fuentes-oficiales/ministerio-interior.md` (y, si el material lo justifica, `docs/fuentes-oficiales/casos-penales.md` con las otras puertas), en Markdown, con esta estructura:

1. **Qué publica el Ministerio del Interior y dónde**: para cada sección de `gub.uy/ministerio-interior` (comunicación/noticias, comunicados, resoluciones, transparencia activa según la ley 18.381 art. 5, datos y estadísticas del Observatorio Nacional sobre Violencia y Criminalidad, convocatorias, trámites), la URL, qué tipo de documento hay, desde qué año, y un ejemplo real leído con `pnpm fuente` con su cita literal (≥ 20 caracteres). Si una sección da 403 o es una aplicación que `pnpm fuente` ve vacía, decí cómo se lee (código fuente, `curl`, otra URL).
2. **Qué no publica y por qué**: certificados de antecedentes, legajos, sumarios: son datos personales (ley 18.331) y lo que existe públicamente es lo que el ministerio dijo en un comunicado, lo que un ministro leyó en el Parlamento, o lo que respondió a un pedido de informes. Documentalo con la norma (IMPO) y con un ejemplo.
3. **Las otras puertas para un caso penal**, cada una con URL, qué hay, cómo se busca, y un ejemplo leído: Parlamento (versiones taquigráficas de interpelaciones y comisiones; pedidos de informes del art. 118 y sus respuestas; el truco de `infolegislativa.parlamento.gub.uy/temporales/` que solo aparece en el código fuente), Fiscalía (`fiscalia.gub.uy`: comunicados de formalizaciones, acusaciones y condenas), Poder Judicial (Base de Jurisprudencia Nacional Pública: qué cubre y qué no), Presidencia (`gub.uy/presidencia`: resoluciones, comunicados, audios), IMPO (normas: Código Penal, Código del Proceso Penal, decreto 382/999 sobre certificados de antecedentes, ley 18.331, ley 18.381).
4. **Acceso a la información pública (ley 18.381)**: cómo se hace un pedido (Unidad de Acceso a la Información Pública, `tramites.gub.uy`), plazos, qué se puede pedir y qué no, y cómo entra la respuesta al sitio (`documento_oficial`, con la resolución de respuesta como fuente). Es una vía para el mantenedor, no para un agente.
5. **Recomendaciones para las instrucciones**: qué agregarías a `.claude/agents/investigador.md` y a `.claude/agents/resolvedor.md` para que ningún chequeo penal quede en «discutible» con el documento a un clic.

Cada URL que cites tiene que estar leída en esta sesión con `pnpm fuente` (o con `WebFetch` si es un índice o una aplicación, diciéndolo). Nada de memoria. Cada búsqueda y URL a `inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl`, y `notas.md` ahí mismo con lo que no pudiste confirmar.

## Reglas
1. No investigues ningún caso concreto ni a ninguna persona: si un ejemplo nombra a alguien, usalo solo para mostrar dónde está el documento y no repitas lo que dice sobre la persona.
2. No toques `content/` ni `data/`. Escribís solo en `docs/fuentes-oficiales/` y en tu carpeta del inbox.
3. Todo con fecha de lectura (`retrieved_at`) en el propio documento.

## Salida esperada
`docs/fuentes-oficiales/ministerio-interior.md` (y `casos-penales.md` si corresponde), `inbox/metodo/ministerio-interior/2026-09-07/consultas.jsonl` y `notas.md`. Informe final: qué secciones del ministerio tienen documentos, cuáles no, qué puertas alternativas resultaron mejores, las recomendaciones para las instrucciones, y el modelo con el que corriste.
