# Brief de investigación · corrida 2026-09-05-lacalle-pou-economia-combustibles

Regla 0: objetividad por encima de todo. Este brief pide cubrir el período completo y todo lo que la persona dijo sobre el tema, favorable o desfavorable, consistente o contradictorio. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief` y aplicá el criterio simétrico.

## 1. Político
- slug: `lacalle-pou`
- nombre: Luis Alberto Aparicio Alejandro Lacalle Pou (Luis Lacalle Pou)
- partido: Partido Nacional
- alias: Lacalle Pou, Luis Lacalle Pou, Luis Alberto Lacalle Pou, Lacalle, LLP
- alias ambiguos: "Lacalle": También nombra a su padre Luis Alberto Lacalle Herrera, presidente 1990-1995 y senador después; en notas anteriores a 2015 o que hablen de "Lacalle Herrera" o "el expresidente Lacalle" no asignar sin confirmar. | "Luis Lacalle": Ambos, padre e hijo, se llaman Luis Alberto Lacalle; desambiguar por el segundo apellido (Pou / Herrera) o por la fecha.
- mandatos:
- Miembro de la Cámara de Representantes por Canelones: 2000-02-15 → 2015-02-15
- Presidente de la Cámara de Representantes: 2011-03-01 → 2012-03-01
- Senador de la República: 2015-02-15 → 2019-08-12
- Presidente de la República: 2020-03-01 → 2025-03-01
- estado actual: fuera_de_cargo (salida: fin_de_mandato el 2025-03-01)
- período a cubrir: desde la campaña previa al primer mandato (1999) hasta hoy (2026-09-05), incluidas oposición y posmandato.

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
Mención: { politico, referente (slug de content/referentes; si falta, proponelo en notas.md bajo referentes_faltantes) o politico_mencionado (slug de content/politicos), fecha, cita, contexto, sentido: positivo|negativo|neutral, evidencia }.
No escribas `revision`, `tier`, `procedencia`, `etiqueta_legal` ni `id`.

## 4. Medios (la regla de dos fuentes usa la columna grupo)

Esta tabla es el estado de `content/medios/` al 2026-09-05. Si un medio que necesitas no figura, puede ser que se haya dado de alta despues: verifica con `ls content/medios/` antes de anotarlo como faltante.
| slug | nombre | grupo | alineamiento |
|---|---|---|---|
| 180-com-uy | Portal 180 | portal-180 | sin_datos |
| afp | Agence France-Presse | afp | independiente |
| ambito | Ámbito | grupo-ambito | sin_datos |
| andina-peru | Andina (Agencia Peruana de Noticias) | estado-peruano | estatal |
| brecha | Brecha | cooperativa-brecha | progresista |
| busqueda | Búsqueda | magnolio | sin_datos |
| caras-y-caretas | Caras y Caretas | editora-caras-y-caretas | progresista |
| cooperativa-cl | Cooperativa.cl (Radio Cooperativa) | compania-chilena-de-comunicaciones | sin_datos |
| efe | Agencia EFE | sepi-estado-espanol | estatal |
| el-observador | El Observador | werthein-hochbaum | sin_datos |
| el-pais | El País | scheck-aguirre | oficialista_tradicional |
| en-perspectiva | En Perspectiva (Radiomundo) | lecueder-cotelo | sin_datos |
| grupo-r-multimedio | Grupo R Multimedio (Diario La R) | r-multimedio | sin_datos |
| icndiario | ICN Diario | icn | sin_datos |
| impo | IMPO (Diario Oficial) | estado-uruguayo | estatal |
| infobae | Infobae | grupo-infobae | sin_datos |
| jutep | JUTEP | estado-uruguayo | estatal |
| la-diaria | la diaria | cooperativa-la-diaria | independiente |
| la-republica | La República | reg-sa | progresista |
| lacallepou-uy | lacallepou.uy (sitio de campaña) | partido-nacional | oficialista_tradicional |
| montevideo-portal | Montevideo Portal | montevideo-comm | sin_datos |
| mpp | MPP (mpp.org.uy) | frente-amplio | progresista |
| parlamento | Parlamento del Uruguay | estado-uruguayo | estatal |
| prensa-mercosur | Prensa Mercosur | prensa-mercosur | sin_datos |
| presidencia | Presidencia de la República | estado-uruguayo | estatal |
| radio-carve | Radio Carve | casa-zorrilla | sin_datos |
| subrayado | Subrayado (Canal 10) | fontaina-de-feo | sin_datos |
| teledoce | Telemundo (Canal 12) | cardoso | sin_datos |
| telenoche | Telenoche (Canal 4) | monte-carlo-romay-salvo | sin_datos |
| tv-ciudad | TV Ciudad | intendencia-montevideo | estatal |
| vtv | VTV | tenfield | sin_datos |
| wikipedia | Wikipedia en español | wikimedia | sin_datos |
| youtube | YouTube | google | sin_datos |

Si citás un medio que no está en la tabla, usá el slug que corresponda al canal o diario y anotalo en `notas.md` bajo `medios_faltantes` para que el editor lo cree.

## 5. Reglas duras
1. Primero `pnpm corpus:buscar "<politico> <tema>" --politico lacalle-pou --desde 1999-01-01` y variantes con los alias del tema; web después, y solo lo que el corpus no cubre.
2. Toda página, PDF o video que vayas a citar se lee con `pnpm fuente <url>`. Nunca cites una URL que no abriste con `pnpm fuente` en esta sesión. Leé barato: `pnpm fuente <url> --tema economia/combustibles` devuelve hasta 6000 caracteres y, si la nota es más larga, un índice de los tramos posteriores al corte que mencionan al político o al tema; leé un tramo con `--desde <carácter> --maximo 1500`, buscá frases con `--buscar "frase | otra frase"` (todas las frases de una nota en una sola llamada), y en documentos muy largos empezá por `--indice --politico lacalle-pou --tema economia/combustibles`. Reservá `--completo` para cuando de verdad necesites el documento entero.
3. `cita` es copia literal de lo que devolvió `pnpm fuente`; si no están las palabras exactas, no hay registro.
4. Preferí documento oficial (Presidencia, Parlamento, DGI, BCU, INE, MEF, URSEA, ANCAP, JUTEP), diario de sesiones o video con marca de tiempo. La prensa es `reportado`.
5. Para `reportado`, dos grupos distintos o `_faltante: segunda_fuente`.
   Además de grupo distinto, buscá **alineamiento distinto**. Medido sobre el contenido publicado al 2026-09-05, el 82 % de las fuentes que cita el sitio son de medios con alineamiento `sin_datos` y **ninguna** es de un medio `oficialista_tradicional`. Eso no es equilibrio: es que se citan siempre los mismos. Antes de cerrar un registro con dos fuentes `sin_datos`, probá si el hecho está cubierto por El País (oficialista_tradicional), Brecha o La República (progresista), o Búsqueda.
   **Para El País no alcanza con `WebSearch`: el buscador no devuelve ese dominio y contesta "sin resultados", que parece falta de cobertura y no lo es.** Usá `pnpm descubrir elpais.com.uy --desde <AAAA-MM> --hasta <AAAA-MM> --terminos <alias del tema>`, que lee el sitemap del propio diario, y después leé las candidatas con `pnpm fuente`. La República ya se lee bien (el cliente reintenta por curl ante un 403); no la marques `verificacion: manual` sin comprobarlo. Si buscaste, probaste el sitemap y no está, decilo en `notas.md`; eso también es información.
6. No investigues casos judiciales; si aparecen, una linea en `casos_vistos`.
7. No escribas tier, procedencia ni id.
8. Cada búsqueda y cada URL leída va a `consultas.jsonl`, en orden.
9. Pistas cruzadas sobre otros políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<otro>.yaml`.
10. Cubrí el período completo: campaña, gobierno, oposición y posmandato. Registrá también lo consistente (`sin_cambio` sirve).

## 6. Pistas pendientes del corpus
```yaml
# Pistas para lacalle-pou. Las carga el brief del investigador antes de googlear.
pistas:
  - url: https://www.infobae.com/america/america-latina/2025/10/23/uruguay-rescinde-contrato-con-astillero-espanol-cardama-por-patrullas-oceanicas-hay-indicios-de-estafa/
    que_vi: >-
      El gobierno de Orsi rescindió en octubre de 2025 el contrato con el astillero español Cardama
      (dos patrullas oceánicas para la Armada, 82,2 millones de euros) y denunció penalmente a la
      empresa por "fuertes indicios de fraude o estafa" en la garantía de cumplimiento (una empresa
      británica, EuroCommerce, que resultó ser una "empresa de papel"). El contrato había sido firmado
      a mediados de 2023 por el Ministerio de Defensa de la gestión de Lacalle Pou (ministro Javier
      García). En agosto de 2026 (visto en búsqueda web, no verificado con pnpm fuente) la denuncia
      penal del gobierno nombraría como indagados a exjerarcas de esa gestión: los exministros de
      Defensa Javier García y Armando Castaingdebat, el exdirector de Secretaría Fabián Martínez y el
      exresponsable de Recursos Financieros Damián Galó. Es un caso central sobre la gestión de
      Lacalle Pou, no sobre la de Orsi (que aparece solo como el gobierno que denuncia y demanda).
    fecha: 2025-10-23
    tema_probable: transparencia-corrupcion
    agregada: 2026-09-04T19:22:00.000Z
    por: investigador (corrida 2026-09-04-orsi-transparencia-corrupcion)

  - url: https://www.elobservador.com.uy/nota/lacalle-pou-y-el-paralelismo-de-las-gabardinas-de-ancap-con-un-gobierno-de-coalicion-20195520206
    que_vi: >-
      Esta era una pista de corpus/pistas/vazquez.yaml (cargada en el brief de la corrida
      2026-09-04-vazquez-economia-combustibles) que resultó ser, al abrirla, una declaración de
      Lacalle Pou, no de Vázquez: como precandidato nacionalista, el 2019-05-06 en un acto de la
      lista 40, dijo que "unos pocos al amparo y al calor del poder estaban haciendo mucho dinero,
      negocios hechos porque el gobierno les dio la posibilidad de hacer los negocios con sus
      amigos, muy cercanos al expresidente Mujica y a Tabaré Vázquez", en referencia al caso Ancap
      (procesamiento de Raúl Sendic) y a los negocios de Uruguay con Venezuela. Es materia de
      transparencia-corrupcion, no de economia/combustibles (mi tema de esta corrida), y el hablante
      es Lacalle Pou, no Vázquez, así que no me correspondía registrarla ahí tampoco. La dejo acá
      por si la corrida de lacalle-pou + transparencia-corrupcion no la cubrió todavía (no verifiqué
      el contenido de inbox/lacalle-pou/transparencia-corrupcion/, solo que la carpeta existe).
    fecha: 2019-05-06
    tema_probable: transparencia-corrupcion
    agregada: 2026-09-05T17:10:00.000Z
    por: investigador (corrida 2026-09-04-vazquez-economia-combustibles)

```

## 7. Salida esperada
Carpeta `inbox/lacalle-pou/economia/combustibles/2026-09-05/` con `declaraciones.yaml`, `promesas.yaml`, `menciones.yaml`, `consultas.jsonl` y `notas.md` (secciones: candidatos_giro, hipotesis, casos_vistos, verificacion_manual, cobertura_del_periodo, objeciones_al_brief, medios_faltantes). Informe final: carpeta, registros por archivo, cuántos con `_faltante`, candidatos a giro, hipótesis, modelo con el que corriste, objeciones.
