# Brief de investigación · corrida 2026-09-04-lacalle-pou-economia-combustibles

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
- período a cubrir: desde la campaña previa al primer mandato (2019) hasta hoy (2026-09-04), incluidas oposición y posmandato.

## 2. Tema
- slug: `economia/combustibles` · nombre: Combustibles · padre: economia
- descripción: Precio y regulación de los combustibles, gestión de ANCAP y mecanismo de fijación de precios.
- alias: combustibles, nafta, gasoil, precio del combustible, ANCAP, URSEA, precio de paridad de importación, PPI, supergás, refinería, La Teja
- temas hijos: ninguno

## 3. Esquema (extracto)
Fuente: { url, medio (slug de la tabla de medios), fecha (YYYY-MM-DD), tipo: video|nota|documento_oficial|diario_de_sesiones|redes, titulo?, cita (literal, ≥ 20 caracteres), marca_tiempo (obligatoria si video; segundos o hh:mm:ss), retrieved_at }.
Evidencia: { nivel: textual|reportado, fuentes: [Fuente, ...] }. `textual` solo con video, documento oficial o diario de sesiones. `reportado` exige dos fuentes de distinto `grupo`; si no, `_faltante: segunda_fuente`.
Declaración: { politico, tema, fecha, contexto: campaña|gobierno|oposicion|entrevista|parlamento|redes, cargo_en_ese_momento, cita, resumen, evidencia }.
Promesa: { politico, tema, texto, fecha_promesa, origen: Evidencia, evidencias_candidatas?: [{ fecha, tipo: ley|decreto|accion_de_gobierno|dato_oficial|declaracion|omision, efecto: a_favor|en_contra|neutral, descripcion, evidencia }] } (sin `estado`).
Mención: { politico, mencionado, fecha, cita, contexto, evidencia }.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| afp | Agence France-Presse | afp | independiente |
| brecha | Brecha | cooperativa-brecha | progresista |
| busqueda | Búsqueda | magnolio | sin_datos |
| caras-y-caretas | Caras y Caretas | editora-caras-y-caretas | progresista |
| efe | Agencia EFE | sepi-estado-espanol | estatal |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| jutep | JUTEP | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
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
1. Primero `pnpm corpus:buscar "<politico> <tema>" --politico lacalle-pou --desde 2019-01-01` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
6. No investigues casos judiciales; si aparecen, una línea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `/Users/santiago/Documents/GitHub/la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (`sin_cambio` sirve).

## 6. Pistas pendientes del corpus
```yaml
(sin pistas registradas)
```

## 7. Salida esperada
Carpeta `inbox/lacalle-pou/economia/combustibles/2026-09-04/` con `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `consultas.jsonl` y `notas.md` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.
