# Brief de investigación · corrida 2026-09-06-lacalle-pou-economia-combustibles

Regla 0: objetividad por encima de todo. Este brief es una vuelta corta sobre un registro ya publicado, disparada por la revisión de un lector. El mismo tratamiento se aplica a cualquier registro de cualquier político que tenga datos dentro de la cita o una conferencia con registro oficial: buscar el original y chequear los datos no es un favor ni un castigo para nadie. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `lacalle-pou`
- nombre: Luis Alberto Aparicio Alejandro Lacalle Pou (Luis Lacalle Pou)
- partido: Partido Nacional
- alias: Lacalle Pou, Luis Lacalle Pou, Luis Alberto Lacalle Pou, Lacalle, LLP
- alias ambiguos: "Lacalle" también nombra a su padre Luis Alberto Lacalle Herrera; desambiguar por el segundo apellido (Pou / Herrera) o por la fecha.
- mandato que importa acá: Presidente de la República, 2020-03-01 → 2025-03-01.

## 2. Tema
- slug: `economia/combustibles` · nombre: Combustibles · padre: economia
- alias: combustibles, nafta, gasoil, precio del combustible, ANCAP, URSEA, precio de paridad de importación, PPI, supergás, refinería, La Teja

## 3. Encargo (solo esto; no investigues nada más)

Registro publicado: `content/declaraciones/lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto.yaml`. Leelo con `Read` antes de empezar. Cita: «Estamos convencidos de que es una medida de transparencia y que el uruguayo no paga sobrecosto». Dicho en la conferencia de prensa de la noche del referéndum sobre la LUC, 27 de marzo de 2022. Hoy tiene dos notas de prensa (Subrayado, El País), nivel `reportado`, y el resumen contiene dos datos concretos sin chequear.

### A. Registro primario de la conferencia

1. Buscá el registro oficial de esa conferencia, en este orden:
   - `pnpm corpus:buscar "referéndum LUC" --politico lacalle-pou --desde 2022-03-26 --hasta 2022-03-30` y variantes: "etapa superada", "ley que queda firme", "sobrecosto", "combustibles Brasil", "mecanismo".
   - Presidencia: `www.gub.uy/presidencia/comunicacion/noticias/` para el 27 y el 28 de marzo de 2022 (la noticia oficial suele traer el audio o el video embebido y a veces la transcripción completa), y `medios.presidencia.gub.uy` / `archivo.presidencia.gub.uy`. La raíz de esos dominios da 403; las rutas profundas se leen bien.
   - El canal de YouTube de Presidencia (`@PresidenciaUruguay-b2s`, listas "streams" y "videos"). Para encontrar el video: `WebSearch` con `site:youtube.com Presidencia Uruguay Lacalle Pou 27 de marzo de 2022 referéndum conferencia` y variantes; el título oficial suele ser "Conferencia de prensa del presidente Luis Lacalle Pou" con la fecha. Si el stream oficial no aparece, sirve el de un canal de TV (Subrayado, Teledoce, Canal 5) o de un portal, pero el oficial va primero si existe.
   - Cuando tengas la URL del video: `pnpm fuente <url> --buscar "sobrecosto | transparencia | Brasil | mecanismo | combustible"`. Eso lo transcribe (Whisper) y devuelve los tramos con su marca de tiempo. Si es largo, primero `pnpm fuente <url> --indice --politico lacalle-pou --tema economia/combustibles`.
2. Entregá en `declaraciones.yaml` **una** copia del registro con `_slug: mecanismo-transparencia-no-paga-sobrecosto` (así conserva el id publicado), `_investigacion`, y las fuentes en este orden:
   1. La primaria: `tipo: video` con `marca_tiempo` donde empieza la cita, `contexto` con el pasaje completo transcripto alrededor (todo el tramo sobre combustibles, aunque sean varias oraciones), `pregunta` si estaba respondiendo a una pregunta de un periodista (textual si se entiende), `url_nota` si el video está embebido en una noticia oficial, `literalidad: literal`. O `tipo: documento_oficial` si Presidencia publicó la transcripción completa, con la cita literal de ahí.
   2. Las dos notas actuales, con sus `cita` intactas y con `verificada_en: {url: <URL de la primaria>, marca_tiempo: <dónde está ese pasaje>}`.
   `nivel: textual` si conseguiste la primaria. Si no la conseguiste, dejá el registro como está (sin `verificada_en`) y explicá en `notas.md` qué probaste, URL por URL.
   No escribas `titulo`, ni `literalidad` de las notas, ni `revision`: eso lo pone el editor.
3. Si en la primaria hay más pasajes sobre combustibles que el registro no tiene (por ejemplo la explicación de "no se trasladaron los costos"), van dentro de `contexto`; no abras registros nuevos.

### B. Chequeos de los datos dentro del resumen

El `resumen` del registro contiene dos datos concretos:

1. "más de USD 1.700 millones de sobrecostos" pagados en el quinquenio anterior (2015-2019). `fragmento` exacto: `más de USD 1.700 millones de sobrecostos`.
2. "por primera vez los combustibles eran más baratos que en Brasil". `fragmento` exacto: `por primera vez los combustibles eran más baratos que en Brasil`.

Para cada uno, un registro en `chequeos.yaml` (formato en tus instrucciones) con `declaracion: lacalle-pou/2022-03-27-mecanismo-transparencia-no-paga-sobrecosto`, `fragmento` copiado tal cual, `afirmacion` (el dato en una frase completa: qué, cuánto, cuándo), `dato_real` y `evidencia` (para `evidencia` sirven las fuentes de la declaración). Vos no calificás.

Dónde buscar el dato oficial:

- **Sobrecostos.** La cifra la usó el gobierno a partir de comparar el precio de venta de ANCAP con el precio de paridad de importación (PPI) que calcula URSEA. Buscá el informe o la serie oficial: `ursea.gub.uy` (informes mensuales de PPI, "Precios de Paridad de Importación"), `catalogodatos.gub.uy` (datasets de URSEA, ANCAP y MIEM; el catálogo tiene API en `catalogodatos.gub.uy/api/3/action/package_search?q=...`), `presidencia.gub.uy` y `miem.gub.uy` (si el Ejecutivo publicó el cálculo o lo dijo en una conferencia con transcripción), y el Parlamento (versión taquigráfica de la comisión donde MIEM o ANCAP presentaron la cifra; `parlamento.gub.uy`). Registrá exactamente qué dice la fuente oficial: período, monto, método. Si el monto no existe como dato oficial y lo que hay es una serie de la que alguien lo derivó, decilo: `dato_real.valor` describe la serie y sus valores en el período, y el registro lleva `_faltante: dato_oficial` si ninguna fuente oficial afirma el monto.
- **Brasil.** Precios al público de gasolina y diesel en Brasil en marzo de 2022 según la ANP (`gov.br/anp`, "Levantamento de Preços de Combustíveis", serie semanal; también en `dados.gov.br`), precios de Uruguay en la misma fecha (decreto de precios de marzo de 2022 en `impo.com.uy` o `gub.uy`; URSEA o ANCAP), y tipo de cambio del BCU (`bcu.gub.uy`) y del Banco Central do Brasil para convertir. La comparación por litro en dólares para nafta (Super 95 / gasolina comum) y gasoil (50S / diesel S10) es el `dato_real.valor`, con las fuentes de cada número. "Por primera vez" es parte de la afirmación: si encontrás series históricas de los dos países, anotá si hubo períodos anteriores con Uruguay más barato; si no las encontrás, decilo.
- Si algún medio o verificador (Verificado.uy, UYCheck, El Observador, la diaria, Búsqueda, El País, Montevideo Portal) chequeó estas cifras en 2022, leelo con `pnpm fuente` y ponelo en `evidencia.fuentes` del chequeo: es prensa, no reemplaza al documento oficial, pero le sirve al editor.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

La tabla de `content/medios/` es la del brief 2026-09-05 de esta misma persona y tema; verificá con `ls content/medios/` antes de anotar un medio como faltante. Los organismos oficiales de otros países no están en la tabla: para la ANP usá `anp-brasil` y para el Banco Central do Brasil `bcb-brasil`, y anotalos en `medios_faltantes` con el dato de propiedad (organismos del Estado brasileño, `grupo: estado-brasileno`, `alineamiento: estatal`). URSEA: verificá si existe `ursea`; si no, `medios_faltantes` (organismo del Estado uruguayo, `grupo: estado-uruguayo`, `alineamiento: estatal`).

| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| 180-com-uy | Portal 180 | portal-180 | sin_datos |
| brecha | Brecha | cooperativa-brecha | progresista |
| busqueda | Búsqueda | magnolio | sin_datos |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| impo | IMPO (Diario Oficial) | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| parlamento | Parlamento del Uruguay | estado-uruguayo | estatal |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| subrayado | Subrayado (Canal 10) | fontaina-de-feo | sin_datos |
| teledoce | Telemundo (Canal 12) | cardoso | sin_datos |
| telenoche | Telenoche (Canal 4) | monte-carlo-romay-salvo | sin_datos |
| youtube | YouTube | google | sin_datos |

## 5. Reglas duras
1. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `--tema economia/combustibles`, `--buscar "frase | otra frase"`, `--desde <carácter> --maximo 1500`, `--indice`; `--completo` casi nunca.
2. `cita` es copia literal y contigua de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
3. Preferí documento oficial, diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
4. No escribas tier, procedencia, id, `titulo`, `calificacion` ni `analisis`.
5. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
6. Pistas cruzadas sobre otros políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<otro>.yaml`.
7. No investigues casos judiciales.
8. Este lote no es una corrida completa del tema: no busques otras declaraciones de combustibles. Solo el registro primario de esa conferencia y los dos chequeos.

## 6. Salida esperada
Carpeta `inbox/lacalle-pou/economia/combustibles/2026-09-06/` con `declaraciones.yaml` (un registro), `chequeos.yaml` (dos registros), `promesas.yaml` y `menciones.yaml` (listas vacías), `consultas.jsonl`, y `notas.md` con las secciones de siempre (candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes) más `## registro_primario`: qué encontraste y dónde, o qué probaste, URL por URL. Informe final: carpeta, si conseguiste la primaria y de qué tipo, cuántos chequeos con dato oficial y cuántos con `_faltante`, el modelo con el que corriste (tal cual lo conocés), y las objeciones al brief si las hubo.
