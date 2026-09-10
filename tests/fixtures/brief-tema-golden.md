# Brief de investigación · corrida 2026-09-10-lacalle-pou-economia-impuestos

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `lacalle-pou`
- nombre: Luis Alberto Aparicio Alejandro Lacalle Pou (Luis Lacalle Pou)
- partido: Partido Nacional
- alias: Lacalle Pou, Luis Lacalle Pou, Luis Alberto Lacalle Pou, Lacalle, LLP
- alias ambiguos: "Lacalle": También nombra a su padre Luis Alberto Lacalle Herrera, presidente 1990-1995 y senador después; en notas anteriores a 2015 o que hablen de "Lacalle Herrera" o "el expresidente Lacalle" no asignar sin confirmar. | "Luis Lacalle": Ambos, padre e hijo, se llaman Luis Alberto Lacalle; desambiguar por el segundo apellido (Pou / Herrera) o por la fecha.
- mandatos:
- Presidente de la República: 2020-03-01 → 2025-03-01
- estado actual: fuera_de_cargo (salida: fin_de_mandato el 2025-03-01)
- período a cubrir: desde la campaña previa al primer mandato (2019) hasta hoy (2026-09-10), incluidas oposición y posmandato.

## 2. Tema
- slug: `economia/impuestos` · nombre: Impuestos · padre: economia
- descripción: Creación, aumento, rebaja o exoneración de impuestos y tasas, y promesas al respecto.
- alias: impuestos, impuesto, tributos, tributaria, carga tributaria, IVA, IRPF, IRAE, IASS, IMESI, DGI, presión fiscal, suba de impuestos, no subir impuestos, rebaja de IVA, exoneración
- temas hijos: ninguno

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss, donde empieza la cita), marca_tiempo_contexto (donde empieza el contexto, si escribís `contexto`), contexto?, pregunta?, retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. `textual` solo con video, documento oficial o diario de sesiones. `reportado` exige dos fuentes de distinto `grupo`; si no, `_faltante: segunda_fuente`.
Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin `estado`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
Chequeo (crudo, sin calificación): { politico, declaracion (id publicado, o `<politico>/<fecha>-<_slug>` si la declaración está en este lote), tema, fecha, afirmacion, fragmento (tramo exacto de la cita o del resumen donde está el dato), dato_real: { valor, fuentes[] con documento oficial si existe }, evidencia } o `_faltante: dato_oficial`.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 3b. Reglas de las colecciones de esta corrida

Copiadas de `docs/colecciones/`; el ejemplo completo de cada registro está en `docs/ejemplos/`.

(falta docs/colecciones/declaraciones.md)

(falta docs/colecciones/promesas.md)

(falta docs/colecciones/menciones.md)

(falta docs/colecciones/chequeos.md)

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de `content/medios/` al 2026-09-10. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| busqueda | Búsqueda | magnolio | sin_datos |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| wikipedia | Wikipedia en español | wikimedia | sin_datos |

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en `notas.md` bajo `medios_faltantes` para que el editor lo cree.

## 5. Reglas duras
1. Primero `pnpm corpus:buscar "<politico> <tema>" --politico lacalle-pou --desde 2019-01-01` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema economia/impuestos` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico lacalle-pou --tema economia/impuestos`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
   **Si la nota dice "conferencia de prensa", "discurso", "cadena nacional" o "acto oficial", buscá el texto oficial antes de citar al periodista.** El Estado publica la versión completa: una gacetilla de `www.presidencia.gub.uy` trae ~1.500 caracteres, pero un discurso en `medios.presidencia.gub.uy` trae 23.636 y una conferencia en `archivo.presidencia.gub.uy` trae 63.990. Citar la crónica da `reportado` y exige dos grupos de medios; citar el documento oficial da `textual` y no exige segundo grupo. La raíz de esos dominios da 403 (bloquean el listado), pero las rutas profundas se leen bien. Si no aparece el texto, el canal de YouTube de Presidencia (`@PresidenciaUruguay-b2s`) tiene los streams: `yt-dlp --skip-download --write-auto-subs --sub-langs es` baja los subtítulos sin el video, que sirven para ubicar el pasaje y sacar la `marca_tiempo` pero **no para citar** (son ASR de un vivo). Para citar de audio se transcribe con `pnpm transcribir`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento `sin_datos` y **ninguna** es de un medio `oficialista_tradicional`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes `sin_datos`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda.
   **Para El País no alcanza con `WebSearch`: el buscador no devuelve ese dominio y contesta "sin resultados", que parece falta de cobertura y no lo es.** Usá `pnpm descubrir elpais.com.uy --desde <AAAA-MM> --hasta <AAAA-MM> --terminos <alias del tema>`, que lee el sitemap del propio diario, y después leé las candidatas con `pnpm fuente`. La República ya se lee bien (el cliente reintenta por curl ante un 403); no la marques `verificacion: manual` sin comprobarlo. Si buscaste, probaste el sitemap y no está, decilo en `notas.md`; eso también es información.
6. Los casos judiciales van por el barrido simétrico (regla 12 de CLAUDE.md), no por esta corrida; si aparece uno, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
   Cada cifra, fecha, cantidad o comparación que la persona afirma dentro de una cita o un resumen es un chequeo: va a `chequeos.yaml` con `fragmento` y el dato oficial que permita juzgarlo (INE, BCU, MEF, DGI, URSEA, ANCAP, Parlamento, catalogodatos.gub.uy; para una comparación con otro país, el organismo oficial de ese país), o con `_faltante: dato_oficial` y lo que sí encontraste. No calificás: eso es del editor. El mismo umbral de qué es "un dato" vale para cualquier político. Si encontraste el registro primario, la `afirmacion` sigue a la primaria (con sus reservas), no a la prensa; si el resumen dice otra cosa, anotalo en `notas.md` bajo `resumen_vs_primaria`. Decidí vos si una cifra es un dato concreto o una figura retórica ("100 %", "mil veces"): si es retórica, no hay chequeo y lo decís en `notas.md` con el motivo. Cualquier lista de datos que traiga el brief es punto de partida, no lista cerrada: si al leer la cita encontrás otro dato, también se chequea, y el criterio es el mismo para todos los políticos.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `__CORPUS_DIR__/pistas/<otro>.yaml`.
10. Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (`sin_cambio` sirve).

## 6. Pistas pendientes del corpus
```yaml
(sin pistas registradas)
```

## 7. Salida esperada
Carpeta `inbox/lacalle-pou/economia/impuestos/2026-09-10/` con `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `chequeos.yaml`, `consultas.jsonl` y `notas.md` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.
