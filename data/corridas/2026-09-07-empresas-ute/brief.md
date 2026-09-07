# Brief de investigación · corrida 2026-09-07-empresas-ute

Regla 0: objetividad por encima de todo. Esta corrida arma la ficha de UTE en la colección `empresas` con el mismo criterio que la de ANCAP (`content/empresas/ancap.yaml`, leela como modelo): qué es, qué hace, cómo le va con la plata de todos, y qué dicen a favor y en contra de su diseño. Las cifras se registran como cifras, sin adjetivos ni verbos de intención; si hay actividades reservadas por ley, los argumentos a favor y en contra se documentan con el mismo esfuerzo, en palabras de quien los sostiene, y el esquema no valida un solo lado. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Sujeto
- slug: `ute` · UTE, Administración Nacional de Usinas y Trasmisiones Eléctricas
- alias: UTE, la eléctrica estatal
- Si existe `content/medios/ute.yaml` es UTE como publicadora; esta ficha es la empresa como sujeto.

## 2. Encargo

Escribí `inbox/empresas/ute/2026-09-07/empresas.yaml` con un solo registro que valide contra `src/schemas/empresa.ts` (leé el esquema; es la forma exacta): `nombre`, `nombre_completo`, `tipo` (empresa_publica), `alias`, `creacion` (fecha, norma, fuentes), `que_hace` + `que_hace_fuentes`, `monopolio` (`tiene`, `alcance`, `normas`, `argumentos_a_favor`, `argumentos_en_contra`), `finanzas[]` (un ítem por año 2015-2024: `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`, `segmentos[]` si los estados contables informan por segmento: generación, trasmisión, distribución, comercialización; `nota` cuando haga falta), `comparaciones[]` (solo lo que una fuente compare: tarifas residenciales o industriales entre países, según CIER, OLADE, CEPAL, ECLAC, consultoras contratadas por el Estado o prensa con datos), `fuentes[]`. Los montos `usd` en millones con un decimal (`unidad: millones`) y `tipo_cambio: cierre` con la cotización que declare el propio balance.

Cómo trabajar, en este orden:
1. Corpus primero: `pnpm corpus:buscar "UTE balance" --desde 2015-01-01` y variantes (resultado, ganancia, pérdida, Rentas Generales, tarifas, monopolio, generación privada, contratos, Central Batlle, eólica, "UTE Premia", deuda).
2. Balances: `ute.com.uy` (sección institucional / transparencia / estados contables auditados), `ain.gub.uy`, `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=ute`), Rendición de Cuentas del MEF para transferencias a Rentas Generales, versiones taquigráficas del Parlamento donde UTE presentó resultados. Cada año con su PDF leído con `pnpm fuente` y cita literal del renglón del resultado, del total de impuestos y de la nota de tipo de cambio.
3. Marco legal: la ley de creación (Ley 4.273 de 1912) y la Ley 14.694 (Ley Nacional de Electricidad, 1977) y sus modificaciones (Ley 16.832 de 1997, que abrió la generación a privados y creó la UREE/URSEA; el decreto reglamentario), en `impo.com.uy`: qué tiene reservado hoy (trasmisión, distribución) y qué no (generación).
4. Argumentos: de los dos lados, en palabras de quien los sostiene, con fuente cada uno (Presidencia, UTE, sindicato AUTE, partidos, URSEA, academia, prensa). Mismo esfuerzo para cada lado; si un lado te cuesta más, decilo en `notas.md`.
5. Comparaciones: solo lo que una fuente compare. Nada calculado por vos.
6. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## anios_sin_balance`, `## medios_faltantes`.

## 3. Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Leé barato.
2. `cita` es copia literal y contigua.
3. Preferí documento oficial (estados contables, leyes, Rendición de Cuentas, URSEA, Parlamento). La prensa es `reportado`.
4. No escribas tier, procedencia, id ni `resumen` (los pone el editor). No toques `content/`.
5. Pistas cruzadas sobre políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<politico>.yaml`.
6. No investigues casos judiciales; si aparecen, una línea en `casos_vistos`.
7. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
8. Al cerrar, `pnpm validar --inbox inbox/empresas/ute/2026-09-07` (los únicos errores admisibles son medios que el editor va a crear).

## 4. Salida esperada
Carpeta `inbox/empresas/ute/2026-09-07/` con `empresas.yaml`, `consultas.jsonl` y `notas.md`. Informe final: qué años de balance conseguiste, qué encontraste sobre transferencias y capitalizaciones, cuántos argumentos de cada lado, qué comparaciones con fuente, el modelo con el que corriste, objeciones al brief.
