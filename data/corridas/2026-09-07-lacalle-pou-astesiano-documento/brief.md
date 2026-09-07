# Brief de resolución · corrida 2026-09-07-lacalle-pou-astesiano-documento

Regla 0: objetividad por encima de todo. Se busca el documento oficial que le falta a un chequeo publicado para que el Veracímetro pueda calificarlo con verde o rojo; el mismo pedido vale para cualquier chequeo de cualquier político que esté en «discutible» solo por falta de documento oficial.

## 1. Encargo

El chequeo `content/chequeos/lacalle-pou/2022-09-26-astesiano-antecedentes-penales.yaml` (leelo con `Read`) califica «discutible» la afirmación de Lacalle Pou del 26 de setiembre de 2022 de que Alejandro Astesiano «no tiene antecedentes penales». No es por duda sobre los hechos: dos medios de grupos distintos, uno con confirmación atribuida al Ministerio del Interior, informaron dos procesamientos por estafa (2002 y 2013, este último con prisión) y una condena de 2014. Es por regla: `verdadero` y `falso` exigen al menos una fuente `documento_oficial` en `dato_real.fuentes`, y ahí solo hay prensa. Un lector preguntó por qué no es «falso». La respuesta correcta es encontrar el documento.

Buscá, en este orden, y leé con `pnpm fuente` lo que cites:
1. **Parlamento**: la versión taquigráfica de la interpelación o comparecencia del ministro del Interior (Luis Alberto Heber) y de la comisión que trató el caso Astesiano en 2022-2023 (`parlamento.gub.uy`, diario de sesiones de Senado y Diputados, octubre de 2022 en adelante; también la comisión investigadora si la hubo). Ahí suele constar la lectura del legajo y los antecedentes. Es `tipo: diario_de_sesiones` y habilita verde o rojo.
2. **Poder Judicial / Fiscalía**: la sentencia de condena de Astesiano de 2023 (proceso abreviado por la trama de pasaportes) puede citar sus antecedentes; la Fiscalía publica comunicados en `fiscalia.gub.uy` y el Poder Judicial en `poderjudicial.gub.uy` (base de jurisprudencia). La sentencia de 2014 por estafa, si es pública.
3. **Ministerio del Interior**: la investigación administrativa sobre por qué los antecedentes no figuraban en los informes de 2020 y 2021, y cualquier resolución o comunicado oficial (`gub.uy/ministerio-interior`).
4. **Presidencia**: el pedido del legajo que el presidente anunció el 30 de setiembre de 2022 y lo que Presidencia publicó después (`gub.uy/presidencia`).

También: qué significa «antecedentes penales» en Uruguay (procesamiento, condena, plazo de cómputo para reincidencia, certificado de antecedentes judiciales), con fuente normativa (`impo.com.uy`: Código Penal, decreto-ley 14.470 sobre registro de antecedentes, o lo que corresponda), porque el editor va a tener que decidir si «procesado en 2002 y 2013, condenado en 2014» es «tener antecedentes penales» en setiembre de 2022 bajo alguna lectura razonable, y decirlo en el análisis.

Entregá en `inbox/reparaciones/astesiano-documento-2026-09-07/chequeos.yaml` una copia del chequeo con `_id: lacalle-pou/2022-09-26-astesiano-antecedentes-penales` (no `_slug`), `_investigacion`, y las fuentes nuevas agregadas a `dato_real.fuentes` (documento oficial primero) con cita literal del renglón que dice qué antecedentes tenía. No cambies `calificacion`, `analisis` ni `titulo`: el editor califica. Si no encontrás ningún documento oficial, dejá la copia sin cambios y explicá en `notas.md`, URL por URL, qué probaste.

## 2. Reglas duras
1. Toda página o PDF que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión.
2. `cita` es copia literal y contigua.
3. Es un caso judicial ya resuelto para Astesiano (condena de 2023) y una afirmación pública del presidente: solo lo que consta en fuentes públicas, con fecha y estado; no investigues más allá del punto (los antecedentes que tenía al 26-09-2022 y qué dicen los documentos oficiales).
4. No escribas tier, calificación ni análisis. No toques `content/`.
5. Cada búsqueda y URL a `consultas.jsonl`. `notas.md` con las secciones de siempre.
6. Todo registro lleva `_investigacion: {agente: resolvedor, modelo: <el modelo con el que corrés>}`.

## 3. Salida esperada
Carpeta `inbox/reparaciones/astesiano-documento-2026-09-07/` con `chequeos.yaml`, `consultas.jsonl` y `notas.md`. Informe final: qué documento oficial encontraste (o no), qué dice literalmente sobre los antecedentes, qué dice la norma sobre qué es un antecedente penal, el modelo con el que corriste, y objeciones al brief.
