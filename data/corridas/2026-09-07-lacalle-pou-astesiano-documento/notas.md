# Notas — reparación de `lacalle-pou/2022-09-26-astesiano-antecedentes-penales`

Corrida `2026-09-07-lacalle-pou-astesiano-documento`. Modelo: Sonnet (claude-sonnet-5), por instrucción del orquestador (no es el modelo que indica `.claude/agents/resolvedor.md` en la tabla de `EXPERIMENTO.md`, que en el repo dice Sonnet igualmente para este rol — no hay discrepancia en este caso puntual).

## 1. Parlamento (orden 1 del brief) — ENCONTRADO

El caso Astesiano se trató en el Senado el 12 de octubre de 2022, en régimen de Comisión General (no fue una interpelación formal con "llamado a sala" en el sentido del art. 119, sino una comparecencia acordada; el asunto parlamentario es carpeta 797/2022, "CUSTODIA PRESIDENCIAL"). Compareció el ministro del Interior Luis Alberto Heber junto al prosecretario de Presidencia Rodrigo Ferrés y el director de la Secretaría de Inteligencia Estratégica del Estado Álvaro Garcé; el senador convocante fue Alejandro Sánchez (Frente Amplio).

El Diario de Sesiones de esa sesión (32.ª Sesión Extraordinaria) está publicado en `infolegislativa.parlamento.gub.uy` (subdominio del propio Parlamento). En su intervención, el senador Sánchez lee en sala el prontuario completo de Astesiano, con fecha y hecho de cada entrada desde 1999. Los tres datos que hacían falta están ahí, textuales:

- **2002**: "procesado sin prisión por el delito de estafa en concusión real de dos delitos descritos."
- **2013** (18 de marzo): "procesado con prisión por un delito continuado de estafa, y cumplió cuatro meses en la cárcel Las Rosas."
- **2014** (setiembre): "condenado por estafa —setiembre de 2014— a dieciocho meses, pero no los cumplió en prisión porque ya había tenido la preventiva en 2013."

Esto confirma punto por punto lo que ya decía `dato_real.valor` a partir de prensa, y agrega un dato que la prensa no tenía: la condena de 2014 fue a **dieciocho meses**, no cumplidos en prisión por la preventiva ya purgada en 2013.

**Problema de acceso**: la URL "linda" del Parlamento (`parlamento.gub.uy/documentosyleyes/documentos/diarios-de-sesion/6440/SSN`) es una SPA en Angular; `pnpm fuente` solo trae el cascarón HTML (sin el texto) porque el contenido se carga por JavaScript después de cargada la página. El texto real vive en `infolegislativa.parlamento.gub.uy/temporales/<fecha>s<id-largo>.html`, un link que solo aparece en el código fuente de la página SPA, no en el resultado renderizado ni indexado por buscadores. Lo encontré inspeccionando el HTML fuente de esa página (no listado en ningún buscador). Dejo la URL de `infolegislativa` como la citable porque es la que efectivamente tiene el texto y la que `pnpm fuente` pudo archivar; anoto la de `documentosyleyes` en este archivo por si el editor prefiere enlazar la landing "oficial" además de la que tiene el contenido.

**Aviso técnico importante** (ver también el informe final): el `tipo` de esta fuente es `diario_de_sesiones`, no `documento_oficial`. El brief (línea 10) dice "Es tipo: diario_de_sesiones y habilita verde o rojo", y `CLAUDE.md` lista "Parlamento" entre los organismos que habilitan un chequeo verde/rojo. Pero revisé `src/schemas/chequeo.ts` (línea 62-63) y `src/lib/probable.ts` (línea 100): la puerta que exige "documento oficial" para calificar `verdadero`/`falso` chequea literalmente `f.tipo === 'documento_oficial'`. Un `diario_de_sesiones` no la satisface por sí solo, aunque sea la transcripción oficial del propio Parlamento. Esto no lo decido yo ni lo corrijo (no toco código ni `content/`); lo dejo escrito para que el mantenedor vea si es una inconsistencia entre la regla editorial y el esquema, o si es deliberado (un diario de sesiones registra lo que dijo un senador, no necesariamente un hecho certificado, así que tiene sentido que sea más débil que un decreto o una sentencia — pero entonces el texto del brief y de `CLAUDE.md` debería decirlo así de explícito).

## 2. Poder Judicial / Fiscalía (orden 2 del brief) — NO ENCONTRADO como documento publicado

- No hay sentencia de 2014 (estafa) publicada en `poderjudicial.gub.uy`. La página `poderjudicial.gub.uy/40-sentencias` que sugería un resultado de búsqueda da 404 con esa ruta; no encontré buscador de sentencias de juzgados letrados de primera instancia por nombre. Es esperable: es una condena de proceso ordinario de un juzgado del interior (Maldonado, cárcel Las Rosas), no una sentencia de casación ni un caso que la Suprema Corte publique en su repositorio.
- La condena de 2023 (caso pasaportes) sí tiene un documento público: Fiscalía publicó "el texto de la acusación de Fossati" (mencionado en la nota de Subrayado del 15/02/2023), pero ese documento describe el delito de 2022 (venta de pasaportes), no los antecedentes de 2002-2014. No es la pieza que este chequeo necesita, así que no lo agrego.
- No encontré comunicado de Fiscalía ni del Poder Judicial, en sus propios sitios, sobre los antecedentes previos de Astesiano.

## 3. Ministerio del Interior (orden 3 del brief) — NO ENCONTRADO como documento publicado, pero con hallazgo relevante en prensa

El Ministerio sí abrió una investigación administrativa de urgencia (confirmada por múltiples medios) y el propio ministro Heber reconoció en conferencia de prensa que en 2015 "hubo una maniobra" para ocultar los antecedentes. El resultado: separaron del cargo a Gonzalo Vázquez (director de Identificación Criminal) por reponer y no informar la corrección. El Observador cita textualmente ("informe al que accedió El Observador") una frase del informe: *"A través de la auditoría realizada por esta unidad, no ha sido posible establecer qué usuario pudo desasociar el número de cédula de identidad"*. Pero ese informe **no está publicado** en `gub.uy/ministerio-interior` ni en ningún dominio oficial que haya podido encontrar; solo existe citado por la prensa. Por regla del esquema (`tipo: documento_oficial` exige que la URL citada sea la del organismo, no la del diario que lo cita), no lo puedo agregar como fuente oficial.

**Hallazgo aparte, no incorporado al registro pero relevante para el análisis del editor**: Montevideo Portal (08/10/2022, "El oficio de la Justicia con el que Interior argumenta que Astesiano no posee antecedentes") reconstruye el mecanismo técnico: en 2015 el Juzgado Letrado de Primera Instancia libró un oficio que comunicaba el cierre/extinción de la causa de estafa, y ese oficio es la base con la que el Ministerio sostiene, incluso hoy, que "no tiene antecedentes" en el sistema. Es decir: hay una explicación oficial (aunque no un documento oficial *publicado*) para por qué la ficha decía que no tenía antecedentes, además de la maniobra de 2015 que borró el antecedente de 2013 de la base de Policía Científica. Esto es relevante porque matiza el "no tiene antecedentes" del presidente: hay una lectura técnica (la de Interior, apoyada en el oficio de 2015) y una lectura de hecho histórico (procesado dos veces, condenado una). No es mi rol resolver esa tensión — se la dejo señalada al editor en este archivo y en el informe final, tal como pide el brief.

## 4. Presidencia (orden 4 del brief) — no hay documento adicional

Presidencia pidió el legajo de todos los custodios el 28/09/2022 (ya cubierto por prensa, ya citado indirectamente en el registro). No encontré que Presidencia haya publicado ese legajo ni un documento propio con los antecedentes de Astesiano. La revelación de que Lacalle Pou sabía (por los chats de Astesiano, según Wikipedia/prensa) es un hecho posterior y de otra naturaleza (no un documento oficial sobre antecedentes).

## 5. Qué dice la norma sobre "antecedente penal" — ENCONTRADO

El brief sugería como pista `decreto-ley 14.470`. Lo revisé en `impo.com.uy`: **no es la norma correcta**. Ese decreto-ley (1975) regula el régimen de trabajo penitenciario, no el registro de antecedentes. Lo señalo para que no se repita la búsqueda.

La norma que sí regula qué puede figurar como antecedente penal es el **Decreto 382/999** (07/12/1999, IMPO), que sigue vigente (solo su artículo 5 fue modificado por el decreto 163/022 de 2022; los artículos 3 y 4, que son los que importan acá, siguen como en el original). Dice:

- Art. 3: en un Certificado de Antecedentes Judiciales "solamente se podrán consignar (...) las resoluciones y sentencias judiciales que hubieren recaído sobre el individuo".
- Art. 4: "Está especialmente prohibido, consignar en el referido Certificado hechos que no tengan su fundamento en una conducta condenada por la ley y acreditada por la justicia competente."

Leído en conjunto: bajo esta norma, lo que legalmente cuenta como "antecedente" en el certificado oficial es una **condena** (sentencia), no un mero procesamiento o una indagatoria. Aplicado al caso: el procesamiento de 2002 (sin prisión) y el de 2013 (con prisión) son, en sentido estricto de este decreto, procesamientos, no condenas por sí solos — pero la condena de setiembre de 2014 ("condenado por estafa (...) a dieciocho meses", según el Diario de Sesiones) sí es exactamente el tipo de hecho que el artículo 4 dice que debe figurar. Es decir: bajo la propia norma que el Ministerio invoca para sostener "no tiene antecedentes", Astesiano parece tener al menos un antecedente penal legítimo (la condena de 2014) que debería haber podido figurar en un certificado bien expedido — más allá de que, por la maniobra de 2015, no figurara en la práctica. Esto es una lectura mía de la norma para que el editor la tenga a mano; no es una calificación y no toqué `analisis` ni `calificacion`.

## 6. Qué no hice

No investigué el caso de pasaportes de 2022-2023 en sí (condena, apelaciones, libertad anticipada de 2024): es la causa ya resuelta y no es lo que pide el brief. Solo until el punto pedido: qué antecedentes tenía Astesiano al 26/09/2022 y qué dicen los documentos oficiales sobre eso.
