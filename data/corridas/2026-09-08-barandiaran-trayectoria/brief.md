# Brief de investigación · corrida 2026-09-08-barandiaran-trayectoria

Regla 0: objetividad por encima de todo. Esta corrida cubre la trayectoria pública de **Gabriel Barandiarán**, que fue Representante Nacional (diputado) por el Partido Colorado, en la prensa, en campaña, en redes y en sus cargos: declaraciones y sus giros en el tiempo, promesas contra gestión, cifras que afirmó (para el Veracímetro) y menciones a referentes. El criterio es exactamente el mismo que para cualquier otra persona del sitio: nada se agrega ni se omite por quién sea, por su partido ni por quién lo conozca; se registra lo consistente y lo contradictorio, lo favorable y lo desfavorable, con el mismo esfuerzo; solo fuentes públicas. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

Otro investigador arma en paralelo la ficha base y el registro parlamentario (corrida `2026-09-08-barandiaran-ficha`, carpeta `inbox/barandiaran/ficha/2026-09-08/`): no dupliques eso. Vos cubrís todo lo demás. Empezá por confirmar quién es con fuente (partido, departamento, período como diputado; el corpus tiene una sola mención, un PDF del Parlamento con una lista de diputados: `pnpm corpus:buscar "Barandiarán"`), y si hay más de una persona con ese nombre, resolvé la ambigüedad antes de cargar nada.

## Encargo

En `inbox/barandiaran/trayectoria/2026-09-08/`, con el formato de salida de tu archivo de rol (`declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `chequeos.yaml`, cada uno una lista, vacía si no hay):
1. **Declaraciones** (`politico: barandiaran`): todo lo que dijo públicamente con posición sobre un tema, en entrevistas, columnas, conferencias, redes, actos de campaña y gestión, en todo el período (antes, durante y después de su mandato, hasta hoy). `tema` es un slug existente de `content/temas/` (leé `ls content/temas/` y sus subcarpetas; si ninguno calza, el más cercano y `temas_faltantes` en `notas.md`), `contexto` según corresponda, `cargo_en_ese_momento`, `cita` literal y contigua, `resumen`, `evidencia` con el nivel que corresponda (`textual` solo con video, documento oficial o diario de sesiones; `reportado` con dos grupos de medios distintos o `_faltante: segunda_fuente`). Si hay video o audio, `marca_tiempo` de la cita y `marca_tiempo_contexto` de donde empieza el contexto.
2. **Promesas**: lo que prometió en campaña o desde el cargo, con `fecha_promesa`, `origen` y `evidencias_candidatas` posteriores (leyes, votos, acciones, omisiones), a favor y en contra por igual.
3. **Chequeos**: por cada cifra, fecha o comparación concreta dentro de una cita, un registro con `fragmento` exacto, `afirmacion`, y el dato oficial que la confirma o la desmiente en `dato_real` (INE, BCU, MEF, Parlamento, Corte Electoral, JUTEP); no califiques.
4. **Menciones**: referencias a referentes históricos o a otros políticos, con `sentido`.
5. **`notas.md`** con las secciones de siempre (`candidatos_giro` con pares antes/después, `hipotesis`, `casos_vistos`, `verificacion_manual`, `cobertura_del_periodo`, `objeciones_al_brief`) más `temas_faltantes` y `medios_faltantes`; `consultas.jsonl` con cada búsqueda y URL en orden.

Dónde buscar, en este orden: corpus (`pnpm corpus:buscar`, con el nombre y sus variantes: Barandiarán, Barandiaran, Gabriel Barandiarán); después web: prensa uruguaya (El País, la diaria, Montevideo Portal, El Observador, Búsqueda, Brecha, La República, Subrayado, Telemundo, Telenoche, radios), sitios del Partido Colorado y de su sector, Presidencia, YouTube (entrevistas, sesiones), redes propias (con `verificacion: manual` si `pnpm fuente` no las lee). `pnpm descubrir <medio> --terminos Barandiarán` para los medios cuyo buscador no devuelve resultados. El mismo esfuerzo de búsqueda en medios de todos los alineamientos; al cerrar, decí en `notas.md` cuántas notas encontraste por medio.

## Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Corpus antes que web.
2. `cita` es copia literal y contigua (≥ 20 caracteres); verificá que la cita diga lo que le hacés decir.
3. Solo fuentes públicas y solo su actuación pública. Nada de domicilio, familia, salud ni patrimonio fuera de las declaraciones juradas públicas de la JUTEP.
4. No investigues casos judiciales; si aparecen, una línea en `casos_vistos` con URL. El umbral y la compuerta humana del sitio se aplican después, igual que para cualquiera.
5. Registrá también lo consistente: un `sin_cambio` sirve tanto como un giro.
6. No escribas `revision`, `tier`, `procedencia` ni `id`. No toques `content/`.
7. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
8. Guardá los archivos después de cada bloque: si te interrumpen, que quede lo hecho.
9. Al cerrar, `pnpm validar --inbox inbox/barandiaran/trayectoria/2026-09-08` (los únicos errores admisibles son el político, los medios o los temas que todavía no existen en `content/` y que entran con la otra corrida o los crea el editor).

## Salida esperada
Carpeta `inbox/barandiaran/trayectoria/2026-09-08/` con los cuatro YAML, `consultas.jsonl` y `notas.md`. Informe final: cuántos registros por archivo y de qué años, cuántos con `_faltante`, candidatos a giro, qué medios cubriste y con cuántas notas cada uno, el modelo con el que corriste, objeciones al brief.
