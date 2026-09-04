# Brief de investigación · corrida 2026-09-04-orsi-economia-impuestos

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `orsi`
- nombre: Yamandú Ramón Antonio Orsi Martínez (Yamandú Orsi)
- partido: Frente Amplio
- alias: Yamandú Orsi, Orsi, Yamandú, Yamandú Ramón Antonio Orsi Martínez
- alias ambiguos: ninguno
- mandatos:
- Presidente de la República: 2025-03-01 → en curso
- estado actual: en_cargo
- período a cubrir: desde la campaña previa al primer mandato (2024) hasta hoy (2026-09-04), incluidas oposición y posmandato.

## 2. Tema
- slug: `economia/impuestos` · nombre: Impuestos · padre: economia
- descripción: Creación, aumento, rebaja o exoneración de impuestos y tasas, y promesas al respecto.
- alias: impuestos, impuesto, tributos, tributaria, carga tributaria, IVA, IRPF, IRAE, IASS, IMESI, DGI, presión fiscal, suba de impuestos, no subir impuestos, rebaja de IVA, exoneración
- temas hijos: ninguno

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss), retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. `textual` solo con video, documento oficial o diario de sesiones. `reportado` exige dos fuentes de distinto `grupo`; si no, `_faltante: segunda_fuente`.
Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin `estado`).
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de `content/medios/` al 2026-09-04. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| afp | Agence France-Presse | afp | independiente |
| ambito | Ámbito | grupo-ambito | sin_datos |
| brecha | Brecha | cooperativa-brecha | progresista |
| busqueda | Búsqueda | magnolio | sin_datos |
| caras-y-caretas | Caras y Caretas | editora-caras-y-caretas | progresista |
| efe | Agencia EFE | sepi-estado-espanol | estatal |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| icndiario | ICN Diario | icn | sin_datos |
| impo | IMPO (Diario Oficial) | estado-uruguayo | estatal |
| infobae | Infobae | grupo-infobae | sin_datos |
| jutep | JUTEP | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
| lacallepou-uy | lacallepou.uy (sitio de campaña) | partido-nacional | oficialista_tradicional |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| parlamento | Parlamento del Uruguay | estado-uruguayo | estatal |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| radio-carve | Radio Carve | casa-zorrilla | sin_datos |
| subrayado | Subrayado (Canal 10) | fontaina-de-feo | sin_datos |
| teledoce | Telemundo (Canal 12) | cardoso | sin_datos |
| telenoche | Telenoche (Canal 4) | monte-carlo-romay-salvo | sin_datos |
| wikipedia | Wikipedia en español | wikimedia | sin_datos |
| youtube | YouTube | google | sin_datos |

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en `notas.md` bajo `medios_faltantes` para que el editor lo cree.

## 5. Reglas duras
1. Primero `pnpm corpus:buscar "<politico> <tema>" --politico orsi --desde 2024-01-01` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema economia/impuestos` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico orsi --tema economia/impuestos`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
6. No investigues casos judiciales; si aparecen, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (`sin_cambio` sirve).

## 6. Pistas pendientes del corpus
```yaml
# Pistas para orsi. Las carga el brief del investigador antes de googlear.
pistas:
  - url: https://ladiaria.com.uy/politica/articulo/2026/9/reunion-entre-orsi-y-los-intendentes-en-anchorena-tendra-como-tema-principal-la-coordinacion-por-el-nino/
    que_vi: menciona una linea de credito del gobierno para El Nino
    fecha: null
    tema_probable: economia
    agregada: 2026-09-03T22:31:40.822Z
    por: Mac
  - url: https://www.infobae.com/america/america-latina/2026/07/07/nueva-polemica-con-yamandu-orsi-debia-un-impuesto-por-una-de-sus-casas-y-no-habia-declarado-obras-en-otra/
    que_vi: Orsi debia el impuesto de Primaria de una propiedad y no habia declarado obras en otra; lo pago tras la investigacion periodistica (visto investigando impuestos de Lacalle Pou)
    fecha: 2026-07-07
    tema_probable: economia/impuestos
    agregada: 2026-09-04T00:29:03.312Z
    por: Mac

```

## 7. Salida esperada
Carpeta `inbox/orsi/economia/impuestos/2026-09-04/` con `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `consultas.jsonl` y `notas.md` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.
