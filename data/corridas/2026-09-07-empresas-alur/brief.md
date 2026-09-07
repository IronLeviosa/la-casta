# Brief de investigación · corrida 2026-09-07-empresas-alur

Regla 0: objetividad por encima de todo. Esta corrida arma la ficha de ALUR en la colección `empresas` con el mismo criterio que la de ANCAP (`content/empresas/ancap.yaml`, leela como modelo): qué es, qué hace, cómo le va con la plata de todos, y qué dicen a favor y en contra de su diseño. Las cifras se registran como cifras, sin adjetivos ni verbos de intención; si hay actividades reservadas por ley, los argumentos a favor y en contra se documentan con el mismo esfuerzo, en palabras de quien los sostiene, y el esquema no valida un solo lado. Si algo acá te parece asimétrico, decilo en `objeciones_al_brief`.

## 1. Sujeto
- slug: `alur` · ALUR, Alcoholes del Uruguay S.A.
- alias: ALUR, Alcoholes del Uruguay
- tipo: sociedad_estatal (sociedad anónima de propiedad de ANCAP; verificá la composición accionaria y si hubo socios minoritarios)
- Si existe `content/medios/alur.yaml` es ALUR como publicadora; esta ficha es la empresa como sujeto.

## 2. Encargo

Escribí `inbox/empresas/alur/2026-09-07/empresas.yaml` con un solo registro que valide contra `src/schemas/empresa.ts` (leé el esquema; es la forma exacta) y siguiendo la sección "Empresas públicas" de tu archivo de rol: `nombre`, `nombre_completo`, `tipo`, `alias`, `creacion` (fecha, norma, fuentes), `que_hace` + `que_hace_fuentes`, `monopolio` (`tiene`, `alcance`, `normas`, `argumentos_a_favor`, `argumentos_en_contra`), `finanzas[]` (un ítem por año 2015-2024: `resultado_ejercicio`, `impuestos_pagados`, `transferencias_al_estado`, `capitalizaciones_del_estado`, `deuda_financiera`, `segmentos[]` azúcar, etanol, biodiésel, harinas y aceites o como los nombre cada balance, si los estados contables informan por segmento; `nota` de una oración cuando haga falta), `comparaciones[]` (solo lo que una fuente compare: precio del etanol o del biodiésel de ALUR contra el precio internacional o contra Brasil (URSEA, MIEM, CED, prensa con datos; solo lo que una fuente compare); la fuente es la de quien hizo la comparación, porque la página la imprime como autor), `fuentes[]`. Los montos `usd` en millones con un decimal (`unidad: millones`) y `tipo_cambio: cierre` con la cotización que declare el propio balance.

Los estados contables de ALUR pueden estar publicados por ANCAP (consolidados) o por la propia ALUR: buscá los individuales; si solo hay consolidados, decilo en `nota` del año y en `notas.md`. Las capitalizaciones de ANCAP a ALUR van en `capitalizaciones_del_estado` con `concepto` que lo aclare (ANCAP es el Estado para este fin).

Cómo trabajar, en este orden:
1. Corpus primero: `pnpm corpus:buscar "ALUR balance" --desde 2015-01-01` y variantes (resultado, pérdida, ANCAP, etanol, biodiésel, Bella Unión, caña de azúcar, sobrecosto, Paysandú, capitalización, deuda).
2. Balances: el sitio de la empresa (institucional / transparencia / estados contables auditados), `ain.gub.uy`, `catalogodatos.gub.uy` (API `catalogodatos.gub.uy/api/3/action/package_search?q=alur`), Rendición de Cuentas del MEF para transferencias a Rentas Generales, versiones taquigráficas del Parlamento donde la empresa presentó resultados. Cada año con su PDF leído con `pnpm fuente` y cita literal del renglón del resultado, del total de impuestos y de la nota de tipo de cambio.
3. Marco legal: la Ley de Agrocombustibles 18.195 de 2007 (mezcla obligatoria de etanol y biodiésel), los decretos que fijan porcentajes y precios, y el estatuto o los contratos con ANCAP que definen a quién vende y a qué precio, en `impo.com.uy`. Sobre el monopolio: no es un monopolio legal clásico: la mezcla obligatoria y el contrato con ANCAP le garantizan el comprador; documentá con el mismo esfuerzo los argumentos a favor (política agroindustrial, empleo en Bella Unión, sustitución de importaciones) y en contra (sobrecosto del combustible, precio del etanol contra el internacional, pérdidas cubiertas por ANCAP), cada uno con quién lo sostiene. Regulador: MIEM; los precios de venta a ANCAP los fija el contrato o el decreto.
4. Argumentos: de los dos lados, en palabras de quien los sostiene, con fuente cada uno (Presidencia, la empresa, su sindicato, partidos, el regulador, cámaras privadas, academia, prensa). Mismo esfuerzo para cada lado; si un lado te cuesta más, decilo en `notas.md`.
5. Comparaciones: solo lo que una fuente compare. Nada calculado por vos.
6. Cada búsqueda y URL a `consultas.jsonl`; `notas.md` con las secciones de siempre más `## anios_sin_balance`, `## anios_sin_segmentos`, `## medios_faltantes`.

## 3. Reglas duras
1. Toda página, PDF o video que cites se lee con `pnpm fuente <url>`; nunca cites una URL que no abriste en esta sesión. Leé barato.
2. `cita` es copia literal y contigua.
3. Preferí documento oficial (estados contables, leyes, Rendición de Cuentas, regulador, Parlamento). La prensa es `reportado`.
4. No escribas tier, procedencia, id ni `resumen` (los pone el editor). No toques `content/`.
5. Pistas cruzadas sobre políticos van a `C:\Users\sdsmo\GitHub\la-casta-corpus/pistas/<politico>.yaml`.
6. No investigues casos judiciales; si aparecen, una línea en `casos_vistos`.
7. Todo registro lleva `_investigacion: {agente: investigador, modelo: <el modelo con el que corrés>}`.
8. Al cerrar, `pnpm validar --inbox inbox/empresas/alur/2026-09-07` (los únicos errores admisibles son medios que el editor va a crear).

## 4. Salida esperada
Carpeta `inbox/empresas/alur/2026-09-07/` con `empresas.yaml`, `consultas.jsonl` y `notas.md`. Informe final: qué años de balance conseguiste, qué encontraste sobre transferencias y capitalizaciones, qué años tienen segmentos, cuántos argumentos de cada lado, qué comparaciones con fuente, el modelo con el que corriste, objeciones al brief.
