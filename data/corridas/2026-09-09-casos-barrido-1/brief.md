# Barrido simétrico de casos judiciales, etapa 1: las 25 personas con ficha publicada

Fecha: 2026-09-09. Regla 12 de CLAUDE.md en su versión nueva: los casos judiciales se investigan con
el mismo criterio para todos. Esta es la primera etapa del barrido permanente: las 25 personas que
hoy tienen ficha en `content/politicos/` (presidentes, vicepresidentes, senadores, diputados y
candidatos, de todos los partidos). Las etapas siguientes cubren a los diputados y senadores de las
legislaturas XLIX y L a medida que sus fichas se promueven, en el mismo orden para todos: por cargo,
nunca por partido.

## Qué se busca, para cada persona, en el mismo orden

1. **Fiscalía General de la Nación** (`fiscalia.gub.uy`): comunicados y noticias con el nombre de la
   persona; `pnpm inventario fiscalia.gub.uy --filtro <apellido>` y `pnpm corpus:buscar "<nombre>"
   --medio fiscalia` antes de la web.
2. **Base de Jurisprudencia Nacional** (`bjn.poderjudicial.gub.uy`): sentencias que nombren a la persona.
3. **Parlamento**: pedidos de desafuero (art. 114), comisiones investigadoras y preinvestigadoras que la
   nombren (`biblioteca.parlamento.gub.uy`, diarios de sesiones; `parlamento.gub.uy`, documentos).
4. **JUTEP**: resoluciones y expedientes publicados que la nombren.
5. **Prensa**: `pnpm corpus:buscar "<nombre> denuncia"`, `"<nombre> fiscalía"`, `"<nombre> imputado"`,
   `"<nombre> formalizado"`, `"<nombre> archivo de la causa"`; después la web, y cada nota leída con
   `pnpm fuente`.

## Umbral, el mismo para todos

Entra un caso si hay **denuncia formal presentada, investigación de Fiscalía, o acusación pública hecha
por una persona identificable en un medio**. Trascendidos anónimos, rumores y «fuentes cercanas» van a
`notas.md` (`hipotesis`), nunca a `casos.yaml`. Por cada caso se busca **el desenlace con el mismo
rigor que la acusación**: archivo, absolución, sobreseimiento, desestimación, o el hecho de que la
persona no haya sido imputada. Cada etapa de `estado_judicial[]` con fecha, etapa del esquema y fuente
que diga exactamente eso (documento oficial o dos grupos de medios). Ninguna víctima de identidad
reservada se nombra ni se describe. Sin adjetivos ni verbos de intención.

Los casos que ya existen en `content/casos/` (Astesiano, Cardama, JUTEP declaraciones juradas,
Marset, Penadés) no se vuelven a crear: se anota en `notas.md` qué etapa o desenlace les falta y entra
por corrección. Un caso que involucra a varias personas con ficha se carga una sola vez, con todos los
`involucrados[]` y su rol.

## Resultado por persona, aunque sea «nada»

`notas.md` lleva una tabla con las 25 personas y, para cada una, las cinco búsquedas hechas y qué dio
cada una (incluido «sin resultados»). Un cero solo vale si se ve cómo se buscó: es la única prueba de
que el barrido fue el mismo para todos.

## Regla 0

Mismas fuentes, mismo umbral, mismo esfuerzo para las 25 personas. Si un lote se queda sin tiempo,
dice hasta dónde llegó y con quién, en el orden de la lista, sin saltear a nadie.

## Lotes

- `inbox/casos-barrido-1/a/`: abella, argimon, astori, barandiaran, batlle, bordaberry, cesar-vega, cosse, daniel-martinez.
- `inbox/casos-barrido-1/b/`: delgado, hierro-lopez, lacalle-pou, manini-rios, mieres, mujica, nin-novoa, novick.
- `inbox/casos-barrido-1/c/`: ojeda, orsi, penades, salle, sendic, talvi, topolansky, vazquez.
